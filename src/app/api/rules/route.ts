import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user ID based on email (assuming we sync users or just use email for this simple app)
    // For simplicity in this personal app, we might just query rules by user_email if we modified the schema
    // But strictly we should look up the user first.

    // Let's assume we store rules with a simple lookup for now or just fetch all since it's personal
    // But to be correct with schema:

    const { data: user } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

    if (!user) {
        // If user doesn't exist in our DB yet (maybe first login didn't sync?), strictly return empty or error
        // For this flow, we'll return empty
        return NextResponse.json([]);
    }

    const { data: rules, error } = await supabaseAdmin
        .from('rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(rules);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const { name, sender, subject, template, isActive } = json;

    // 1. Ensure user exists in our DB
    let { data: user } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

    if (!user) {
        // Create the user if they don't exist
        const { data: newUser, error: createError } = await supabaseAdmin
            .from('users')
            .insert([{ email: session.user.email }])
            .select('id')
            .single();

        if (createError || !newUser) {
            return NextResponse.json({ error: "Failed to create user record" }, { status: 500 });
        }
        user = newUser;
    }

    // 2. Create the rule
    const conditions = {
        operator: "OR",
        from: sender ? [sender] : [],
        subject: subject || undefined
    };

    const { data, error } = await supabaseAdmin
        .from('rules')
        .insert([{
            user_id: user.id,
            name,
            conditions,
            reply_template: template,
            is_active: isActive
        }])
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
