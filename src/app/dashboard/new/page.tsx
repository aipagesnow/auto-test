import RuleForm from "@/components/rule-form";

export default function NewRulePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">New Auto-Responder</h1>
                <p className="text-muted-foreground">
                    Set up a new automatic reply for specific incoming emails.
                </p>
            </div>
            <RuleForm />
        </div>
    );
}
