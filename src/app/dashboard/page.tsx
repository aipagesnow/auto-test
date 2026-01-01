import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowRight } from "lucide-react";
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
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Welcome back, {userName} <span className="inline-block animate-wave origin-bottom-right">👋</span></h1>
                    <p className="text-lg text-muted-foreground mt-2">Your automated inbox assistant is online and running.</p>
                </div>
                <div className="hidden md:block">
                    <Button className="shadow-lg shadow-primary/20 bg-primary/90 hover:bg-primary transition-all hover:scale-105" asChild>
                        <Link href="/dashboard/new">
                            <Plus className="mr-2 h-4 w-4" /> New Auto-Responder
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <StatsCards />
            </section>

            {/* Rules Section */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Active Rules</h2>
                        <p className="text-sm text-muted-foreground">Manage your automated response triggers.</p>
                    </div>
                </div>

                {rules.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/20 p-16 bg-muted/5 text-center transition-all hover:bg-muted/10 group"
                    >
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight">
                            No rules active
                        </h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                            You haven&apos;t set up any auto-responders yet. Create your first rule to start automating your inbox.
                        </p>
                        <Link href="/dashboard/new" className="mt-8">
                            <Button size="lg" className="shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all rounded-full px-8 h-12 text-base">
                                Create your first rule <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {rules.map((rule) => (
                            <RuleCard key={rule.id} rule={rule} />
                        ))}

                        {/* Updated Empty Add New Card */}
                        <Link href="/dashboard/new" className="group h-full">
                            <div className="h-full min-h-[240px] flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/10 hover:bg-muted/20 transition-all duration-300 hover:border-primary/50 cursor-pointer shadow-sm hover:shadow-md">
                                <div className="h-14 w-14 rounded-full bg-background border shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                                    <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <span className="font-semibold text-muted-foreground group-hover:text-primary transition-colors">Create New Rule</span>
                                <span className="text-xs text-muted-foreground/60 mt-1">Set up a new trigger</span>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
