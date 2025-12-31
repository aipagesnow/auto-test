"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" // Need to create Badge
import { Edit2, Trash2, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Rule } from "@/types"

interface RuleCardProps {
    rule: Rule
}

export function RuleCard({ rule }: RuleCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md border-border/50">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-bold text-lg">{rule.name}</CardTitle>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {rule.conditions.from?.map((email, i) => (
                                    <span key={i} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                        From: {email}
                                    </span>
                                ))}
                                {rule.conditions.subject && (
                                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                        Sub: {rule.conditions.subject}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Switch checked={rule.is_active} />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                    <div className="bg-muted/50 p-3 rounded-md border border-border/40">
                        <p className="text-sm text-muted-foreground line-clamp-3 font-mono">
                            {rule.reply_template}
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="pt-3 border-t bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Sent: 24</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80" asChild>
                            <Link href={`/dashboard/edit/${rule.id}`}>
                                <Edit2 className="w-4 h-4 text-primary" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
