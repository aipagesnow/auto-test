import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Rule } from "@/types";

async function getRules(email: string) {
    const { data: user } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
    if (!user) return [];

    const { data } = await supabaseAdmin.from('rules').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    return (data as Rule[]) || [];
}

export default async function DashboardPage() {
    const session = await auth();
    const rules = session?.user?.email ? await getRules(session.user.email) : [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">My Rules</h1>
                <Link href="/dashboard/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Responder
                    </Button>
                </Link>
            </div>

            {rules.length === 0 ? (
                <div
                    className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-12"
                >
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            No rules added
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            You haven&apos;t created any auto-responder rules yet.
                        </p>
                        <Link href="/dashboard/new" className="mt-4">
                            <Button>Add Rule</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rules.map((rule) => (
                        <Card key={rule.id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    {rule.name}
                                    <span className={`text-xs px-2 py-1 rounded-full ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {rule.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    {rule.conditions.from?.length ? `From: ${rule.conditions.from.join(', ')}` : 'Matches All Senders'}
                                    {rule.conditions.subject && <span className="block">Subject: {rule.conditions.subject}</span>}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3 bg-muted p-2 rounded">
                                    {rule.reply_template}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
