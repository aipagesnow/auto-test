"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, X, Wand2, Eye, Code2, Type, AlertCircle, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { Rule } from "@/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent as DialogContentModal, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RuleFormProps {
    initialData?: Rule;
}

export default function RuleForm({ initialData }: RuleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // State
    const [name, setName] = useState(initialData?.name || "");
    const [senders, setSenders] = useState<string[]>(initialData?.conditions?.from || []);
    const [newSender, setNewSender] = useState("");
    const [subject, setSubject] = useState(initialData?.conditions?.subject || "");
    const [template, setTemplate] = useState(initialData?.reply_template || "");
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
    const [replyFormat, setReplyFormat] = useState<'text' | 'html'>(initialData?.reply_format || 'text');
    const [previewOpen, setPreviewOpen] = useState(false);

    // Variable insertion
    const insertVariable = (variable: string) => {
        setTemplate((prev) => prev + ` {{${variable}}} `);
    };

    const handleAddSender = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSender.trim()) {
            e.preventDefault();
            if (!senders.includes(newSender.trim())) {
                setSenders([...senders, newSender.trim()]);
            }
            setNewSender("");
        }
    };

    const removeSender = (senderToRemove: string) => {
        setSenders(senders.filter(s => s !== senderToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            name,
            sender: senders.length > 0 ? senders[0] : "", // Legacy support
            senders: senders,
            subject,
            template,
            isActive,
            replyFormat,
            id: initialData?.id // If editing
        };

        try {
            const res = await fetch('/api/rules', {
                method: initialData ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save rule');

            toast.success(initialData ? "Rule updated successfully" : "Rule created successfully");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save rule. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Preview Logic
    const previewText = template
        .replace("{{sender_name}}", "John Doe")
        .replace("{{sender_email}}", "john@example.com")
        .replace("{{subject}}", "Re: " + (subject || "Application"));

    const PreviewCardContent = () => (
        <CardContent className="pt-6 min-h-[400px] bg-background">
            {replyFormat === 'html' ? (
                <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewText }}
                />
            ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans text-foreground">
                    {previewText || <span className="text-muted-foreground italic">Start typing to see preview...</span>}
                </div>
            )}

            {(previewText && replyFormat === 'text') && (
                <div className="mt-8 text-sm text-muted-foreground">
                    <p>Best,<br />Automated Responder</p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t flex gap-3 opacity-50">
                <div className="h-8 w-8 rounded-full bg-primary/20" />
                <div className="space-y-2 flex-1">
                    <div className="h-2 w-1/3 bg-muted rounded" />
                    <div className="h-2 w-1/4 bg-muted rounded" />
                </div>
            </div>
        </CardContent>
    );

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-full">
            {/* Left Column: Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Basics */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-base">Rule Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Job Application Auto-Reply"
                                className="mt-2 text-lg py-6"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Section 2: Triggers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 className="h-4 w-4 text-primary" />
                                Trigger Conditions
                            </CardTitle>
                            <CardDescription>When should this auto-responder fire?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>From Sender (Partial Match)</Label>
                                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-muted/30 rounded-md min-h-[40px] border border-input focus-within:ring-1 focus-within:ring-ring">
                                    <AnimatePresence>
                                        {senders.map(s => (
                                            <motion.div
                                                key={s}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                            >
                                                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                                                    {s}
                                                    <button type="button" onClick={() => removeSender(s)} className="hover:bg-destructive/10 rounded-full p-0.5 transition-colors">
                                                        <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                                    </button>
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <input
                                        className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] placeholder:text-muted-foreground"
                                        placeholder="Type & Enter... (e.g. @google.com)"
                                        value={newSender}
                                        onChange={(e) => setNewSender(e.target.value)}
                                        onKeyDown={handleAddSender}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="subject">Subject Contains</Label>
                                <Input
                                    id="subject"
                                    placeholder="e.g. Application"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 3: Reply Template */}
                    <Card className="border-primary/20 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <MailIcon className="h-4 w-4 text-primary" />
                                    Reply Content
                                </CardTitle>
                                <div className="flex items-center bg-muted/50 rounded-lg p-1 border">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setReplyFormat('text')}
                                        className={cn(
                                            "h-7 text-xs px-3 rounded-md transition-all",
                                            replyFormat === 'text' ? "bg-background shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Type className="h-3 w-3 mr-1.5" /> Text
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setReplyFormat('html')}
                                        className={cn(
                                            "h-7 text-xs px-3 rounded-md transition-all",
                                            replyFormat === 'html' ? "bg-background shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Code2 className="h-3 w-3 mr-1.5" /> HTML
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mr-2 self-center">Insert:</span>
                                {['sender_name', 'sender_email', 'subject'].map(v => (
                                    <Button
                                        key={v}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs bg-background hover:bg-muted font-mono text-muted-foreground"
                                        onClick={() => insertVariable(v)}
                                    >
                                        {`{{${v}}}`}
                                    </Button>
                                ))}
                            </div>
                            <div className="relative">
                                <Textarea
                                    className={cn(
                                        "min-h-[300px] text-sm leading-relaxed p-4 resize-y focus-visible:ring-primary/30 font-mono",
                                        replyFormat === 'html' && "bg-slate-950 text-slate-50 border-slate-800"
                                    )}
                                    placeholder={replyFormat === 'html'
                                        ? "<div>\n  <h1>Hi {{sender_name}},</h1>\n  <p>Thanks for your email...</p>\n</div>"
                                        : "Hi {{sender_name}},\n\nThanks for your email..."
                                    }
                                    value={template}
                                    onChange={(e) => setTemplate(e.target.value)}
                                    required
                                />
                                {replyFormat === 'html' && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-mono rounded border border-blue-500/20">
                                        HTML Mode
                                    </div>
                                )}
                            </div>
                            {replyFormat === 'html' && (
                                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                    <p>HTML emails allow rich formatting. Ensure your HTML is valid. We sanitize output but exercise caution with external scripts.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={isActive}
                                onCheckedChange={setIsActive}
                            />
                            <Label htmlFor="active" className="cursor-pointer">Enable immediately</Label>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="min-w-[140px] shadow-lg shadow-primary/20">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData ? "Update Rule" : "Create Rule")}
                            </Button>
                        </div>
                    </div>
                </form>
            </motion.div>

            {/* Right Column: Preview */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="hidden lg:block space-y-6 sticky top-24 h-fit"
            >
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Live Preview</span>
                    </div>
                    {replyFormat === 'html' && <Badge variant="outline" className="text-[10px] h-5">HTML Render</Badge>}
                </div>

                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogTrigger asChild>
                        <Card className="bg-muted/30 border-dashed relative overflow-hidden shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all group">
                            <div className="absolute top-0 right-0 p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge className="bg-background/80 hover:bg-background text-foreground shadow-sm backdrop-blur-sm gap-1">
                                    <Maximize2 className="h-3 w-3" /> Expand
                                </Badge>
                            </div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />
                            <CardHeader className="bg-background/80 backdrop-blur-sm border-b pb-4">
                                <div className="space-y-2">
                                    <div className="flex gap-3 text-sm">
                                        <span className="text-muted-foreground w-12 text-right font-medium">To:</span>
                                        <span className="font-medium bg-muted/50 px-2 rounded text-foreground">John Doe &lt;john@example.com&gt;</span>
                                    </div>
                                    <div className="flex gap-3 text-sm">
                                        <span className="text-muted-foreground w-12 text-right font-medium">Sub:</span>
                                        <span className="font-medium text-foreground">Re: {subject || "Application"}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <PreviewCardContent />
                        </Card>
                    </DialogTrigger>

                    <DialogContentModal className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-6 py-4 border-b bg-muted/10 flex-row items-center justify-between space-y-0">
                            <DialogTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-primary" />
                                Email Preview
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto bg-muted/20 p-8">
                            <Card className="max-w-3xl mx-auto shadow-xl border-border/50">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                                <CardHeader className="bg-muted/40 border-b pb-6 px-8 pt-8">
                                    <div className="space-y-3">
                                        <div className="flex gap-4 text-base items-center">
                                            <span className="text-muted-foreground w-16 text-right font-medium text-sm uppercase tracking-wide">To</span>
                                            <span className="font-medium bg-background px-3 py-1 rounded-md border shadow-sm text-foreground">John Doe &lt;john@example.com&gt;</span>
                                        </div>
                                        <div className="flex gap-4 text-base items-center">
                                            <span className="text-muted-foreground w-16 text-right font-medium text-sm uppercase tracking-wide">From</span>
                                            <span className="font-medium text-foreground">Your Name &lt;your.email@example.com&gt;</span>
                                        </div>
                                        <div className="flex gap-4 text-base items-center">
                                            <span className="text-muted-foreground w-16 text-right font-medium text-sm uppercase tracking-wide">Sub</span>
                                            <span className="font-medium text-foreground text-lg">Re: {subject || "Application"}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <PreviewCardContent />
                            </Card>
                        </div>
                    </DialogContentModal>
                </Dialog>
            </motion.div>
        </div>
    );
}

function MailIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}
