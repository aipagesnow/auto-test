import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Mail, CheckCircle2, TrendingUp, Zap } from "lucide-react"

export function StatsCards() {
    // TODO: Fetch real stats
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-card/50 ring-1 ring-border/50 transition-all hover:shadow-lg hover:ring-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Rules
                    </CardTitle>
                    <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                        <Zap className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold tracking-tight">3</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="text-green-500 font-medium flex items-center"><TrendingUp className="h-3 w-3 mr-0.5" /> +1</span> since last week
                    </p>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-card/50 ring-1 ring-border/50 transition-all hover:shadow-lg hover:ring-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Emails Processed
                    </CardTitle>
                    <div className="p-2 bg-indigo-500/10 rounded-full text-indigo-500">
                        <Mail className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold tracking-tight">145</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="text-green-500 font-medium flex items-center"><TrendingUp className="h-3 w-3 mr-0.5" /> +18%</span> from yesterday
                    </p>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-card/50 ring-1 ring-border/50 transition-all hover:shadow-lg hover:ring-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        System Status
                    </CardTitle>
                    <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                        <Activity className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">Online</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Last check: 2 mins ago
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
