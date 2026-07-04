export type EOIRuleSeverity = "info" | "review" | "warning" | "critical";

export type EOIRuleActionType =
    | "alert"
    | "record_event"
    | "record_metric"
    | "record_frame"
    | "record_video"
    | "create_evidence";

export type EOIRuleConditionType =
    | "count"
    | "line_cross"
    | `interaction.${string}`;

export class EOIRuleAction {
    public type: EOIRuleActionType = "alert";
    public destinations?: string[];
    public include_frame?: boolean;
    public pre_roll_seconds?: number;
    public post_roll_seconds?: number;
    public parameters?: Record<string, any>;

    constructor(init?: Partial<EOIRuleAction>) {
        Object.assign(this, init);
    }

    public static fromJsonObj(obj: any): EOIRuleAction | undefined {
        if (obj == null) {
            return undefined;
        }

        return new EOIRuleAction({
            type: obj.type ?? "alert",
            destinations: Array.isArray(obj.destinations) ? obj.destinations : undefined,
            include_frame: obj.include_frame,
            pre_roll_seconds: obj.pre_roll_seconds,
            post_roll_seconds: obj.post_roll_seconds,
            parameters: obj.parameters ?? {},
        });
    }
}

export class EOIRuleCondition {
    public type: EOIRuleConditionType = "count";
    public source_config_id?: string | null;
    public detection_config_id?: string | null;
    public primary_config_id?: string | null;
    public secondary_config_id?: string | null;
    public operator?: string | null;
    public count?: number | null;
    public value?: number | null;
    public line_name?: string | null;
    public alert_direction?: string | null;
    public direction?: string | null;
    public dwell_seconds?: number | null;
    public reset_seconds?: number | null;
    public parameters?: Record<string, any>;

    constructor(init?: Partial<EOIRuleCondition>) {
        Object.assign(this, init);
    }

    public static fromJsonObj(obj: any): EOIRuleCondition | undefined {
        if (obj == null) {
            return undefined;
        }

        return new EOIRuleCondition({
            type: obj.type ?? "count",
            source_config_id: obj.source_config_id,
            detection_config_id: obj.detection_config_id,
            primary_config_id: obj.primary_config_id,
            secondary_config_id: obj.secondary_config_id,
            operator: obj.operator,
            count: obj.count,
            value: obj.value,
            line_name: obj.line_name,
            alert_direction: obj.alert_direction,
            direction: obj.direction,
            dwell_seconds: obj.dwell_seconds,
            reset_seconds: obj.reset_seconds,
            parameters: obj.parameters ?? {},
        });
    }

    public detectionConfigId(): string | null {
        return this.source_config_id
            ?? this.detection_config_id
            ?? this.primary_config_id
            ?? null;
    }
}

export class EOIRule {
    public rule_id?: string | null;
    public label?: string | null;
    public enabled: boolean = true;
    public severity: EOIRuleSeverity = "review";
    public condition: EOIRuleCondition = new EOIRuleCondition();
    public actions: EOIRuleAction[] = [new EOIRuleAction({ type: "alert" })];
    public dwell_seconds?: number | null;
    public reset_seconds?: number | null;

    constructor(init?: Partial<EOIRule>) {
        Object.assign(this, init);
    }

    public static fromJsonObj(obj: any): EOIRule | undefined {
        if (obj == null) {
            return undefined;
        }

        return new EOIRule({
            rule_id: obj.rule_id,
            label: obj.label,
            enabled: obj.enabled ?? true,
            severity: obj.severity ?? "review",
            condition: EOIRuleCondition.fromJsonObj(obj.condition) ?? new EOIRuleCondition(),
            actions: Array.isArray(obj.actions)
                ? obj.actions
                    .map(EOIRuleAction.fromJsonObj)
                    .filter((action: EOIRuleAction | undefined): action is EOIRuleAction => action != null)
                : [new EOIRuleAction({ type: "alert" })],
            dwell_seconds: obj.dwell_seconds,
            reset_seconds: obj.reset_seconds,
        });
    }

    public static default(): EOIRule {
        return new EOIRule({
            rule_id: null,
            label: null,
            enabled: true,
            severity: "review",
            condition: new EOIRuleCondition(),
            actions: [new EOIRuleAction({ type: "alert" })],
        });
    }
}
