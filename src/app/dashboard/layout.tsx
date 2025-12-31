import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, Settings, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 lg:flex-row">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="">AutoResponder</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Rules
                        </Link>
                        <Link
                            href="/dashboard/new"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Plus className="h-4 w-4" />
                            New Rule
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="text-xs text-muted-foreground truncate">
                            {session?.user?.email}
                        </div>
                    </div>
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
        </div>
    );
}
