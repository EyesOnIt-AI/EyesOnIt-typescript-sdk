import { EOIResponse } from "../eoiResponse";

/**
 * Request payload for querying video processing status.
 */
export class EOIGetVideoStatusInputs {
    /**
     * @param video_id Video processing identifier returned by `processVideo`.
     */
    constructor(public video_id: string) {
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return this.video_id != null && this.video_id.trim().length > 0
            ? EOIResponse.success()
            : new EOIResponse(false, "video_id must be provided");
    }
}
