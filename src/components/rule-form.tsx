"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function RuleForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        sender: "",
        subject: "",
        template: "",
        isActive: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to save rule');
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error saving rule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Rule Details</CardTitle>
                        <CardDescription>
                            Define when this auto-responder should trigger.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Rule Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Job Applications"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sender">Sender Contains (optional)</Label>
                                <Input
                                    id="sender"
                                    placeholder="@company.com"
                                    value={formData.sender}
                                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject Contains (optional)</Label>
                                <Input
                                    id="subject"
                                    placeholder="Application"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Reply Template</CardTitle>
                        <CardDescription>
                            The email content to send. You can use variables like {"{{sender_name}}"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Label htmlFor="template">Message Body</Label>
                            <Textarea
                                id="template"
                                className="min-h-[200px]"
                                placeholder="Hi {{sender_name}}, thanks for reaching out..."
                                value={formData.template}
                                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <Switch
                                id="active"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                            <Label htmlFor="active">Activate this rule immediately</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end space-x-2">
                        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Create Rule"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    );
}
