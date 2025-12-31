import RuleForm from "@/components/rule-form";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Rule } from "@/types";

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getRule(id: string, email: string) {
    const { data: user } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
    if (!user) return null;

    // Ensure rule belongs to user
    const { data } = await supabaseAdmin.from('rules').select('*').eq('id', id).eq('user_id', user.id).single();
    return data as Rule;
}

export default async function EditRulePage({ params }: PageProps) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.email) redirect("/");

    const rule = await getRule(id, session.user.email);
    if (!rule) redirect("/dashboard");

    return (
        <div className="max-w-6xl mx-auto h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Auto-Responder</h1>
                <p className="text-muted-foreground text-lg mt-1">
                    Update trigger conditions or modify your reply template.
                </p>
            </div>
            <RuleForm initialData={rule} />
        </div>
    );
}
