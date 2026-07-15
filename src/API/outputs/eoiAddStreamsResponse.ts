import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

export interface EOIAddStreamsResult {
    stream_id?: string;
    success: boolean;
    status?: string;
    message?: string;
}

/** Response wrapper for `addStreams`. */
export class EOIAddStreamsResponse extends EOIBaseOutputs {
    public results: EOIAddStreamsResult[] = [];

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        if (Array.isArray(eoiResponse.data?.results)) {
            this.results = eoiResponse.data.results;
        }
    }
}
