import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Need to create Table
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Log } from "@/types";
import { format } from "date-fns";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

async function getLogs(email: string) {
    const { data: user } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
    if (!user) return [];

    // Join with rules to get rule name
    const { data } = await supabaseAdmin
        .from('logs')
        .select('*, rules(name)')
        .order('triggered_at', { ascending: false })
        .limit(50); // Just last 50 for now

    // Filter manually if RLS isn't perfect or just rely on the query if we add user_id to logs to make it easier
    // For now assuming logs don't have user_id, we need to filter by rules belonging to user.
    // Optimization: Add user_id to logs table or do deep filter. 
    // For MVP/Personal use, let's assuming fetching all logs is fine if single user, 
    // BUT since we have multiple users logic in mind, let's just filter in JS for now or trust the join.
    // Only logs for rules owned by this user.
    // Actually our logs schema relates to rules. We should filter logs where rule.user_id = user.id.
    const userRules = await supabaseAdmin.from('rules').select('id').eq('user_id', user.id);
    const ruleIds = userRules.data?.map(r => r.id) || [];

    if (ruleIds.length === 0) return [];

    const { data: logs } = await supabaseAdmin
        .from('logs')
        .select('*, rules(name)')
        .in('rule_id', ruleIds)
        .order('triggered_at', { ascending: false });

    return logs || [];
}

export default async function LogsPage() {
    const session = await auth();
    const logs = session?.user?.email ? await getLogs(session.user.email) : [];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
                <p className="text-muted-foreground text-lg mt-1">
                    History of all auto-responses sent from your account.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Showing the last 50 actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No activity recorded yet.
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Rule</TableHead>
                                        <TableHead>Subject</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log: any) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {log.status === 'sent' ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    )}
                                                    <span className="capitalize">{log.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground font-mono text-xs">
                                                {format(new Date(log.triggered_at), 'MMM d, h:mm a')}
                                            </TableCell>
                                            <TableCell>{log.recipient}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{log.rules?.name || 'Unknown Rule'}</Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-muted-foreground">
                                                {log.subject}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
