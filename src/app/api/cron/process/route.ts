import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { gmail, setCredentials } from "@/lib/gmail";
import { Rule } from "@/types";

// This route should be protected or called by Vercel Cron
// For testing, we can just hit it manually.
export async function GET(req: Request) {
    // 0. Check for valid configuration
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
        process.env.SUPABASE_SERVICE_ROLE_KEY?.includes("placeholder")) {
        console.error("Missing Supabase Environment Variables");
        return NextResponse.json({
            error: "Configuration Incomplete: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel."
        }, { status: 500 });
    }

    try {
        // 1. Fetch all active rules
        const { data: rules, error } = await supabaseAdmin
            .from("rules")
            .select("*, users(refresh_token, email)")
            .eq("is_active", true);

        if (error) throw error;
        if (!rules) return NextResponse.json({ processed: [] });

        const results = [];

        // ... rest of logic




        // Group rules by user to batch Gmail calls
        // (In a real app, we'd handle this more efficiently, maybe one job per user)
        for (const rule of rules) {
            const user = rule.users;
            if (!user?.refresh_token) {
                results.push({ ruleId: rule.id, status: "Skipped (No refresh token)" });
                continue;
            }

            try {
                setCredentials("dummy_access_token", user.refresh_token); // Access token will refresh automatically if refresh_token is valid

                // 2. Fetch unread emails
                // Search for: is:unread -label:auto-replied
                // And match criteria roughly (from: X or subject: Y)
                const q = `is:unread -label:auto-replied ${rule.conditions.from?.length ? `from:(${rule.conditions.from.join(" OR ")})` : ""
                    } ${rule.conditions.subject ? `subject:("${rule.conditions.subject}")` : ""
                    }`;

                const res = await gmail.users.messages.list({
                    userId: "me",
                    q,
                    maxResults: 5 // Process a few at a time to avoid limits
                });

                const messages = res.data.messages || [];

                for (const msg of messages) {
                    if (!msg.id || !msg.threadId) continue;

                    // Get full message details
                    const messageDetail = await gmail.users.messages.get({
                        userId: "me",
                        id: msg.id,
                        format: "full" // We need headers
                    });
                    const headers = messageDetail.data.payload?.headers;
                    const subject = headers?.find(h => h.name === 'Subject')?.value || '(No Subject)';
                    const from = headers?.find(h => h.name === 'From')?.value || '';

                    // Double check specific conditions if needed (API search is approximate)
                    // ...

                    // 3. Send Reply
                    const replyBody = rule.reply_template
                        .replace("{{sender_name}}", from.split('<')[0].trim()) // Simple name extraction
                        .replace("{{subject}}", subject);

                    const rawMessage = createEmail(from, "me", `Re: ${subject}`, replyBody, msg.threadId);

                    await gmail.users.messages.send({
                        userId: "me",
                        requestBody: {
                            raw: rawMessage,
                            threadId: msg.threadId
                        }
                    });

                    // 4. Modify labels (Mark read, add 'auto-replied')
                    // First ensure label exists (omitted for brevity, assume "auto-replied" isn't strictly enforced or create on fly)
                    // Just removing UNREAD is good enough for now to stop loop
                    await gmail.users.messages.modify({
                        userId: "me",
                        id: msg.id,
                        requestBody: {
                            removeLabelIds: ["UNREAD"]
                        }
                    });

                    // 5. Log it
                    await supabaseAdmin.from("logs").insert([{
                        rule_id: rule.id,
                        recipient: from,
                        subject: subject,
                        status: "sent"
                    }]);

                    results.push({ ruleId: rule.id, msgId: msg.id, status: "Replied" });
                }

            } catch (e: any) {
                console.error(`Error processing rule ${rule.id}:`, e);
                results.push({ ruleId: rule.id, error: e.message });
            }
        }

        return NextResponse.json({ success: true, processed: results });
    } catch (error: any) {
        console.error("Cron Job Failed:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// Helper to construct raw email string (base64url encoded)
function createEmail(to: string, from: string, subject: string, message: string, threadId?: string) {
    const str = [
        `To: ${to}`,
        "Content-Type: text/plain; charset=utf-8",
        "MIME-Version: 1.0",
        `Subject: ${subject}`,
        "",
        message
    ].join("\n");

    return Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
