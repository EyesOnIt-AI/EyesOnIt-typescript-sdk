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

export class EOIUpdateInteractionEventStatusResponse extends EOIBaseOutputs {
    public event?: EOIInteractionEvent;

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success && eoiResponse.data?.event != null) {
            this.event = EOIInteractionEvent.fromJsonObj(eoiResponse.data.event);
        }
    }
}
