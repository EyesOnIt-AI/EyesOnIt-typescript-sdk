import { EOIInteractionEventStatus } from "../elements/eoiInteractionEvent";

export class EOIGetInteractionEventsInputs {
    public stream_id?: string | null;
    public region_name?: string | null;
    public start_time?: number | null;
    public end_time?: number | null;
    public rule_type?: string | null;
    public status?: EOIInteractionEventStatus | null;
    public mode?: string | null;
    public severity?: string | null;
    public distance_mode?: string | null;
    public limit?: number | null;
    public offset?: number | null;

    constructor(init?: Partial<EOIGetInteractionEventsInputs>) {
        Object.assign(this, init);
    }
}

export class EOIGetInteractionEventSummaryInputs {
    public stream_id?: string | null;
    public region_name?: string | null;
    public start_time?: number | null;
    public end_time?: number | null;
    public rule_type?: string | null;
    public status?: EOIInteractionEventStatus | null;
    public mode?: string | null;
    public severity?: string | null;
    public distance_mode?: string | null;

    constructor(init?: Partial<EOIGetInteractionEventSummaryInputs>) {
        Object.assign(this, init);
    }
}

export type EOIInteractionHeatmapPreferredCoordinateSpace = "camera" | "world";

export class EOIGetInteractionHeatmapInputs {
    public stream_id?: string | null;
    public region_name?: string | null;
    public start_time?: number | null;
    public end_time?: number | null;
    public rule_type?: string | null;
    public status?: EOIInteractionEventStatus | null;
    public mode?: string | null;
    public severity?: string | null;
    public distance_mode?: string | null;
    public preferred_coordinate_space?: EOIInteractionHeatmapPreferredCoordinateSpace | null = "camera";
    public bin_count_x?: number | null = 64;
    public bin_count_y?: number | null = 36;
    public limit?: number | null = 10000;

    constructor(init?: Partial<EOIGetInteractionHeatmapInputs>) {
        Object.assign(this, init);
    }
}

export class EOIUpdateInteractionEventStatusInputs {
    public event_id: string;
    public status: EOIInteractionEventStatus;
    public reviewer_note?: string | null;

    constructor(event_id: string, status: EOIInteractionEventStatus, reviewer_note?: string | null) {
        this.event_id = event_id;
        this.status = status;
        this.reviewer_note = reviewer_note;
    }
}
