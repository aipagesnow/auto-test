import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, Settings, LogOut, Activity, Archive } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/mode-toggle";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userName = session?.user?.name?.split(' ')[0] || 'User';

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background lg:flex">
                <div className="flex h-16 items-center px-6 border-b">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
                        <Archive className="h-5 w-5" />
                        <span>AutoResponder</span>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col justify-between py-6">
                    <nav className="grid items-start px-4 text-sm font-medium space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/logs"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                        >
                            <Activity className="h-4 w-4" />
                            Activity Logs
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                    </nav>

                    <div className="px-4">
                        <Link href="/dashboard/new">
                            <Button className="w-full shadow-md gap-2 font-semibold">
                                <Plus className="h-4 w-4" /> New Rule
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="p-4 border-t bg-muted/20">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {userName[0]}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium leading-none truncate">{session?.user?.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate mt-1">{session?.user?.email}</p>
                        </div>
                        <ModeToggle />
                    </div>
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:pl-64">
                <div className="h-full p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
                    {children}
                    <Toaster />
                </div>
            </main>
        </div>
    );
}
