export type EOIInteractionEventStatus = "new" | "confirmed" | "dismissed" | "needs_follow_up";

export class EOIInteractionEvent {
    public event_id: string;
    public stream_id: string;
    public stream_url: string;
    public stream_name?: string | null;
    public region_name?: string | null;
    public rule_id: string;
    public rule_label?: string | null;
    public rule_type: string;
    public mode: string;
    public severity?: string | null;
    public primary_config_id?: string | null;
    public secondary_config_id?: string | null;
    public primary_track_id?: string | null;
    public secondary_track_id?: string | null;
    public track_ids: string[] = [];
    public started_at: number;
    public last_seen_at: number;
    public ended_at?: number | null;
    public frame_num?: number | null;
    public status: EOIInteractionEventStatus = "new";
    public reviewer_note?: string | null;
    public false_positive_reason?: string | null;
    public measured_value?: number | null;
    public threshold_value?: number | null;
    public distance_mode?: string | null;
    public evidence_clip_status?: string | null;
    public evidence_clip_id?: string | null;
    public evidence_clip_path?: string | null;
    public evidence_clip_error?: string | null;
    public evidence_clip_requested_at?: number | null;
    public metadata: Record<string, any> = {};
    public created_at?: number | null;
    public updated_at?: number | null;

    constructor(init?: Partial<EOIInteractionEvent>) {
        Object.assign(this, init);
    }

    public static fromJsonObj(obj: any): EOIInteractionEvent | undefined {
        if (obj == null) {
            return undefined;
        }

        return new EOIInteractionEvent({
            event_id: obj.event_id,
            stream_id: obj.stream_id,
            stream_url: obj.stream_url,
            stream_name: obj.stream_name,
            region_name: obj.region_name,
            rule_id: obj.rule_id,
            rule_label: obj.rule_label,
            rule_type: obj.rule_type,
            mode: obj.mode,
            severity: obj.severity,
            primary_config_id: obj.primary_config_id,
            secondary_config_id: obj.secondary_config_id,
            primary_track_id: obj.primary_track_id,
            secondary_track_id: obj.secondary_track_id,
            track_ids: Array.isArray(obj.track_ids) ? obj.track_ids.map((trackId: any) => `${trackId}`) : [],
            started_at: obj.started_at,
            last_seen_at: obj.last_seen_at,
            ended_at: obj.ended_at,
            frame_num: obj.frame_num,
            status: normalizeInteractionEventStatus(obj.status),
            reviewer_note: obj.reviewer_note,
            false_positive_reason: obj.false_positive_reason,
            measured_value: obj.measured_value,
            threshold_value: obj.threshold_value,
            distance_mode: obj.distance_mode,
            evidence_clip_status: obj.evidence_clip_status,
            evidence_clip_id: obj.evidence_clip_id,
            evidence_clip_path: obj.evidence_clip_path,
            evidence_clip_error: obj.evidence_clip_error,
            evidence_clip_requested_at: obj.evidence_clip_requested_at,
            metadata: obj.metadata ?? {},
            created_at: obj.created_at,
            updated_at: obj.updated_at,
        });
    }
}

export function normalizeInteractionEventStatus(value: any): EOIInteractionEventStatus {
    const normalized = `${value ?? ""}`.trim().toLowerCase().replace(/\s+/g, "_");
    if (normalized === "confirmed") return "confirmed";
    if (normalized === "dismissed") return "dismissed";
    if (normalized === "needs_validation" || normalized === "needs_follow_up") return "needs_follow_up";
    return "new";
}
