export type EOIInteractionRuleType =
    | "co_presence"
    | "close_approach"
    | "collision_course_candidate";

export type EOIInteractionRuleMode = "review_only" | "record_metric" | "alert";

export type EOIInteractionRuleSeverity = "info" | "review" | "warning";

export class EOIInteractionRule {
    public rule_id?: string | null;
    public label?: string | null;
    public type: EOIInteractionRuleType = "co_presence";
    public enabled: boolean = true;
    public mode: EOIInteractionRuleMode = "review_only";
    public primary_config_id: string = "";
    public secondary_config_id?: string | null;
    public dwell_seconds: number = 1;
    public reset_seconds: number = 10;
    public severity: EOIInteractionRuleSeverity = "review";
    public parameters?: Record<string, any>;

    constructor(init?: Partial<EOIInteractionRule>) {
        Object.assign(this, init);
    }

    public static fromJsonObj(obj: any): EOIInteractionRule | undefined {
        if (obj == null) {
            return undefined;
        }

        return new EOIInteractionRule({
            rule_id: obj.rule_id,
            label: obj.label,
            type: obj.type,
            enabled: obj.enabled ?? true,
            mode: obj.mode ?? "review_only",
            primary_config_id: obj.primary_config_id,
            secondary_config_id: obj.secondary_config_id,
            dwell_seconds: obj.dwell_seconds ?? 1,
            reset_seconds: obj.reset_seconds ?? 10,
            severity: obj.severity ?? "review",
            parameters: obj.parameters ?? {},
        });
    }

    public static default(): EOIInteractionRule {
        return new EOIInteractionRule({
            rule_id: null,
            label: null,
            type: "co_presence",
            enabled: true,
            mode: "review_only",
            primary_config_id: "",
            secondary_config_id: null,
            dwell_seconds: 1,
            reset_seconds: 10,
            severity: "review",
            parameters: {},
        });
    }
}
