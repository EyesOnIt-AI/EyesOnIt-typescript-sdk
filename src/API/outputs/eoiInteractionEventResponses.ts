import { EOIResponse } from "../eoiResponse";
import { EOIInteractionEvent } from "../elements/eoiInteractionEvent";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

export interface EOIInteractionEventSummary {
    total: number;
    by_rule_type: Record<string, number>;
    by_stream: Record<string, number>;
    by_region: Record<string, number>;
    by_status: Record<string, number>;
    by_severity: Record<string, number>;
}

export type EOIInteractionHeatmapCoordinateSpace = "camera" | "world";

export interface EOIInteractionHeatmapBin {
    x: number;
    y: number;
    count: number;
}

export interface EOIInteractionHeatmapWorldBounds {
    min_x: number;
    max_x: number;
    min_y: number;
    max_y: number;
}

export interface EOIInteractionHeatmap {
    coordinate_space: EOIInteractionHeatmapCoordinateSpace;
    fallback_from?: EOIInteractionHeatmapCoordinateSpace | null;
    bin_count_x: number;
    bin_count_y: number;
    bins: EOIInteractionHeatmapBin[];
    events_with_points: number;
    events_without_points: number;
    frame_width?: number | null;
    frame_height?: number | null;
    bounds?: EOIInteractionHeatmapWorldBounds | null;
}

const emptyHeatmap: EOIInteractionHeatmap = {
    coordinate_space: "camera",
    fallback_from: null,
    bin_count_x: 0,
    bin_count_y: 0,
    bins: [],
    events_with_points: 0,
    events_without_points: 0,
    frame_width: null,
    frame_height: null,
    bounds: null,
};

export class EOIGetInteractionEventsResponse extends EOIBaseOutputs {
    public events: EOIInteractionEvent[] = [];
    public total: number = 0;

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            this.total = eoiResponse.data?.total ?? 0;
            if (Array.isArray(eoiResponse.data?.events)) {
                this.events = eoiResponse.data.events
                    .map(EOIInteractionEvent.fromJsonObj)
                    .filter((event: EOIInteractionEvent | undefined): event is EOIInteractionEvent => event != null);
            }
        }
    }
}

export class EOIGetInteractionEventSummaryResponse extends EOIBaseOutputs {
    public summary: EOIInteractionEventSummary = {
        total: 0,
        by_rule_type: {},
        by_stream: {},
        by_region: {},
        by_status: {},
        by_severity: {},
    };

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success && eoiResponse.data?.summary != null) {
            this.summary = {
                ...this.summary,
                ...eoiResponse.data.summary,
            };
        }
    }
}

export class EOIGetInteractionHeatmapResponse extends EOIBaseOutputs {
    public heatmap: EOIInteractionHeatmap = { ...emptyHeatmap };

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success && eoiResponse.data?.heatmap != null) {
            this.heatmap = mapInteractionHeatmap(eoiResponse.data.heatmap);
        }
    }
}

export class EOIUpdateInteractionEventStatusResponse extends EOIBaseOutputs {
    public event?: EOIInteractionEvent;

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success && eoiResponse.data?.event != null) {
            this.event = EOIInteractionEvent.fromJsonObj(eoiResponse.data.event);
        }
    }
}

function mapInteractionHeatmap(value: any): EOIInteractionHeatmap {
    const coordinateSpace = value.coordinate_space === "world" ? "world" : "camera";
    const fallbackFrom = value.fallback_from === "world" ? "world" : value.fallback_from === "camera" ? "camera" : null;
    return {
        coordinate_space: coordinateSpace,
        fallback_from: fallbackFrom,
        bin_count_x: numberOrDefault(value.bin_count_x, 0),
        bin_count_y: numberOrDefault(value.bin_count_y, 0),
        bins: Array.isArray(value.bins)
            ? value.bins.map(mapInteractionHeatmapBin).filter((bin: EOIInteractionHeatmapBin | undefined): bin is EOIInteractionHeatmapBin => bin != null)
            : [],
        events_with_points: numberOrDefault(value.events_with_points, 0),
        events_without_points: numberOrDefault(value.events_without_points, 0),
        frame_width: nullableNumber(value.frame_width),
        frame_height: nullableNumber(value.frame_height),
        bounds: mapInteractionHeatmapBounds(value.bounds),
    };
}

function mapInteractionHeatmapBin(value: any): EOIInteractionHeatmapBin | undefined {
    if (value == null) {
        return undefined;
    }
    return {
        x: numberOrDefault(value.x, 0),
        y: numberOrDefault(value.y, 0),
        count: numberOrDefault(value.count, 0),
    };
}

function mapInteractionHeatmapBounds(value: any): EOIInteractionHeatmapWorldBounds | null {
    if (value == null) {
        return null;
    }
    return {
        min_x: numberOrDefault(value.min_x, 0),
        max_x: numberOrDefault(value.max_x, 0),
        min_y: numberOrDefault(value.min_y, 0),
        max_y: numberOrDefault(value.max_y, 0),
    };
}

function nullableNumber(value: any): number | null {
    return value == null ? null : numberOrDefault(value, 0);
}

function numberOrDefault(value: any, defaultValue: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : defaultValue;
}
