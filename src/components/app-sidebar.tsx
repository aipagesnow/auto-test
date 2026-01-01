"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, Settings, Activity, Archive, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
    user: {
        name: string;
        email: string;
        initial: string;
    };
    onSignOut: () => Promise<void>;
}

export function AppSidebar({ user, onSignOut }: AppSidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Activity Logs",
            icon: Activity,
            href: "/dashboard/logs",
            active: pathname === "/dashboard/logs",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
            active: pathname === "/dashboard/settings",
        }
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:flex transition-all duration-300">
            {/* Logo */}
            <div className="flex h-20 items-center px-8 border-b border-border/40">
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                        <Archive className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-none tracking-tight">AutoResponder</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">Pro</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col justify-between py-8 px-4">
                <div className="space-y-6">
                    <div className="px-2">
                        <Link href="/dashboard/new">
                            <Button className="w-full justify-start gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-base py-6 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/90">
                                <Plus className="h-5 w-5" /> Create New Rule
                            </Button>
                        </Link>
                    </div>

                    <nav className="space-y-1">
                        <p className="px-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Menu</p>
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    route.active
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                {route.active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />
                                )}
                                <route.icon className={cn("h-5 w-5 transition-colors", route.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* User Profile */}
                <div className="space-y-4">
                    <div className="rounded-xl border bg-card/50 p-4 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                {user.initial}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold leading-none truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate mt-1">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <form action={onSignOut} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full justify-center gap-2 border-dashed hover:border-solid hover:bg-destructive/10 hover:text-destructive transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
