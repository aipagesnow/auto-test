"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Clock, Mail, CheckCircle2 } from "lucide-react"
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
            className="group h-full"
        >
            <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 border-border/60 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="font-bold text-lg flex items-center gap-2">
                                {rule.name}
                                {rule.is_active && <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>}
                            </CardTitle>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {rule.conditions.from?.map((email, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] px-2 h-5 font-medium bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200 dark:border-blue-900 truncate max-w-[150px]">
                                        From: {email}
                                    </Badge>
                                ))}
                                {rule.conditions.subject && (
                                    <Badge variant="outline" className="text-[10px] px-2 h-5 font-medium border-orange-200 text-orange-600 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 truncate max-w-[150px]">
                                        Sub: {rule.conditions.subject}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Switch checked={rule.is_active} className="data-[state=checked]:bg-green-500" />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 py-4">
                    <div className="relative">
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary/20 rounded-full"></div>
                        <div className="pl-4">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Reply Template</h4>
                            <p className="text-sm text-foreground line-clamp-3 font-sans leading-relaxed">
                                {rule.reply_template}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-3 pb-3 border-t bg-muted/30 flex justify-between items-center text-xs text-muted-foreground transition-colors group-hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5" title="Total sent">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="font-medium">24</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Last active">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">2h ago</span>
                        </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background shadow-sm hover:shadow active:scale-95 transition-all" asChild>
                            <Link href={`/dashboard/edit/${rule.id}`}>
                                <Edit2 className="w-3.5 h-3.5 text-foreground" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
