import RuleForm from "@/components/rule-form";

export default function NewRulePage() {
    return (
        <div className="max-w-6xl mx-auto h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">New Auto-Responder</h1>
                <p className="text-muted-foreground text-lg mt-1">
                    Configure triggers and design your automated reply.
                </p>
            </div>
            <RuleForm />
        </div>
    );
}
