import { EOIResponse } from "../eoiResponse";

/**
 * Request payload for stopping video processing.
 */
export class EOIStopVideoInputs {
    /**
     * @param video_id Optional video identifier. Omit or pass `null` to stop all active video processing.
     */
    constructor(public video_id?: string | null) {
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        if (this.video_id == null) {
            return EOIResponse.success();
        }

        return this.video_id.trim().length > 0
            ? EOIResponse.success()
            : new EOIResponse(false, "video_id must not be empty when provided");
    }
}
