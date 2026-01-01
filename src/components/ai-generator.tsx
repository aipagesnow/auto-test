"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader2, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AiGeneratorProps {
    onTemplateSelect: (template: string) => void;
}

export function AiGenerator({ onTemplateSelect }: AiGeneratorProps) {
    const [open, setOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState("");
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setGeneratedHtml(""); // Clear previous

        try {
            const res = await fetch("/api/generate-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) throw new Error("Failed to generate email");

            const data = await res.json();
            if (data.html) {
                setGeneratedHtml(data.html);
            } else {
                toast.error("No HTML returned from AI");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedHtml);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("HTML copied to clipboard");
    };

    const handleUseTemplate = () => {
        onTemplateSelect(generatedHtml);
        setOpen(false);
        toast.success("Template applied to editor!");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1.5 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Magic Create</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-muted/10">
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        AI Email Generator
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Input Section */}
                    <div className="space-y-3">
                        <Label htmlFor="prompt" className="text-base font-medium">Describe your email</Label>
                        <div className="relative">
                            <Textarea
                                id="prompt"
                                placeholder="e.g. A polite but firm email declining a meeting request, suggesting a future time in 2 months..."
                                className="min-h-[100px] resize-none pr-20 text-base"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3">
                                <Button
                                    size="sm"
                                    onClick={handleGenerate}
                                    disabled={loading || !prompt.trim()}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                                    Generate
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Result Section */}
                    {generatedHtml && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <Label className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">Generated Preview</Label>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setGeneratedHtml("")} className="h-6 text-xs text-muted-foreground">
                                        Clear
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleCopy} className="h-6 gap-1 text-xs">
                                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        {copied ? "Copied" : "Copy Code"}
                                    </Button>
                                </div>
                            </div>

                            <Card className="border-purple-200 dark:border-purple-900 bg-slate-50 dark:bg-slate-950/50 shadow-sm overflow-hidden">
                                <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
                                <CardContent className="p-6 overflow-x-auto">
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-slate-900 p-4 rounded-md border shadow-sm"
                                        dangerouslySetInnerHTML={{ __html: generatedHtml }}
                                    />
                                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                                        {generatedHtml}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {!generatedHtml && !loading && (
                        <div className="text-center py-12 text-muted-foreground/50 border-2 border-dashed rounded-lg">
                            <Wand2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>Enter a description above to let the AI work its magic ✨</p>
                        </div>
                    )}

                    {loading && (
                        <div className="py-20 text-center space-y-4">
                            <Loader2 className="h-10 w-10 animate-spin text-purple-500 mx-auto" />
                            <p className="text-muted-foreground animate-pulse">Drafting your masterpiece...</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t p-4 bg-muted/10">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleUseTemplate}
                        disabled={!generatedHtml}
                        className="bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md shadow-purple-500/20"
                    >
                        Use This Template
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
