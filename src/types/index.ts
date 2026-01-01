export interface User {
    id: string;
    email: string;
    refresh_token?: string;
    created_at: string;
}

export type ConditionOperator = 'AND' | 'OR';

export interface RuleConditions {
    operator: ConditionOperator;
    from?: string[]; // Array of email addresses or domains
    subject?: string;
    body?: string;
    exclude?: string[];
}

export interface Rule {
    id: string;
    user_id: string; // Foreign Key
    name: string;
    conditions: RuleConditions;
    reply_template: string;
    reply_format?: 'text' | 'html';
    is_active: boolean;
    delay_minutes: number;
    last_triggered?: string;
    created_at: string;
    updated_at: string;
}

export interface Log {
    id: string;
    rule_id: string;
    recipient: string;
    subject?: string;
    status: 'sent' | 'failed' | 'skipped';
    triggered_at: string;
}
