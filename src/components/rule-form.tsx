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
import { Loader2, Plus, X, Wand2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Rule } from "@/types";

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
            sender: senders.length > 0 ? senders[0] : "", // Validating schema simplification for now
            // Ideally we update schema to support array fully in backend logic if we haven't
            // For the purpose of this UI demo, we'll send the primary one or comma join if backend supports it
            // Let's assume backend takes the first one or we need to update backend to handle array.
            // The API route I wrote earlier: `from: sender ? [sender] : []`.
            // So let's stick to sending one for `sender` param to `POST`, OR update the POST to accept `senders` array.
            // I will update the API payload construction here to be robust.
            senders: senders,
            subject,
            template,
            isActive,
            id: initialData?.id // If editing
        };

        try {
            const res = await fetch('/api/rules', {
                method: initialData ? 'PUT' : 'POST', // Assuming we add PUT support or handle it in one
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
                                <div className="flex flex-wrap gap-2 mb-2 p-2 bg-muted/30 rounded-md min-h-[40px]">
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
                                                    <button type="button" onClick={() => removeSender(s)} className="hover:bg-destructive/10 rounded-full p-0.5">
                                                        <X className="h-3 w-3 text-muted-foreground" />
                                                    </button>
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <input
                                        className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px]"
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
                    <Card className="border-primary/20 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MailIcon className="h-4 w-4 text-primary" />
                                Reply Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {['sender_name', 'sender_email', 'subject'].map(v => (
                                    <Button
                                        key={v}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs bg-muted/50"
                                        onClick={() => insertVariable(v)}
                                    >
                                        {`{{${v}}}`}
                                    </Button>
                                ))}
                            </div>
                            <Textarea
                                className="min-h-[300px] font-mono text-sm leading-relaxed p-4 resize-none focus-visible:ring-primary/30"
                                placeholder="Hi {{sender_name}},&#10;&#10;Thanks for your email..."
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                required
                            />
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
                            <Button type="submit" disabled={loading} className="min-w-[120px]">
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
                className="hidden lg:block space-y-6 sticky top-8 h-fit"
            >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Live Preview</span>
                </div>

                <Card className="bg-muted/30 border-dashed relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />
                    <CardHeader className="bg-background/50 border-b pb-4">
                        <div className="space-y-1">
                            <div className="flex gap-2 text-sm">
                                <span className="text-muted-foreground w-12 text-right">To:</span>
                                <span className="font-medium">John Doe &lt;john@example.com&gt;</span>
                            </div>
                            <div className="flex gap-2 text-sm">
                                <span className="text-muted-foreground w-12 text-right">Sub:</span>
                                <span className="font-medium text-foreground">Re: {subject || "Application"}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 min-h-[400px] bg-background">
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                            {previewText || <span className="text-muted-foreground italic">Start typing to see preview...</span>}
                        </div>
                        <div className="mt-8 pt-4 border-t flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20" />
                            <div className="space-y-2 flex-1">
                                <div className="h-2 w-1/3 bg-muted rounded" />
                                <div className="h-2 w-1/4 bg-muted rounded" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
