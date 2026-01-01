import { auth, signOut } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userName = session?.user?.name || 'User';
    const userEmail = session?.user?.email || '';
    const userInitial = userName[0] || 'U';

    async function handleSignOut() {
        "use server"
        await signOut()
    }

    return (
        <div className="flex min-h-screen w-full bg-muted/40 font-sans">
            <AppSidebar
                user={{
                    name: userName,
                    email: userEmail,
                    initial: userInitial
                }}
                onSignOut={handleSignOut}
            />

            {/* Main Content */}
            <main className="flex-1 lg:pl-72 transition-all duration-300">
                <div className="h-full p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                    <Toaster />
                </div>
            </main>
        </div>
    );
}
