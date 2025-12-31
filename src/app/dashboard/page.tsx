import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Rule } from "@/types";
import { StatsCards } from "@/components/stats-cards";
import { RuleCard } from "@/components/rule-card";

async function getRules(email: string) {
    const { data: user } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
    if (!user) return [];

    const { data } = await supabaseAdmin.from('rules').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    return (data as Rule[]) || [];
}

export default async function DashboardPage() {
    const session = await auth();
    const userName = session?.user?.name?.split(' ')[0] || 'there';
    const rules = session?.user?.email ? await getRules(session.user.email) : [];

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Hey, {userName} 👋</h1>
                <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your auto-responders.</p>
            </div>

            {/* Stats Row */}
            <StatsCards />

            {/* Rules Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Your Rules</h2>
                    <Link href="/dashboard/new" className="md:hidden">
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" /> New
                        </Button>
                    </Link>
                </div>

                {rules.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 bg-card text-center animate-in fade-in zoom-in duration-500"
                    >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">
                            No rules active
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                            You haven&apos;t set up any auto-responders yet. Create one to start automating your inbox.
                        </p>
                        <Link href="/dashboard/new" className="mt-6">
                            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">Create your first rule</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {rules.map((rule) => (
                            <RuleCard key={rule.id} rule={rule} />
                        ))}

                        {/* Empty Add New Card */}
                        <Link href="/dashboard/new" className="group">
                            <div className="h-full min-h-[200px] flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 hover:bg-muted/40 transition-all hover:border-primary/50 cursor-pointer">
                                <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Create New Rule</span>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
