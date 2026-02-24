import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

/**
 * Request payload for retrieving the latest video frame for a stream.
 */
export class EOIVideoFrameInputs {
    /**
     * @param streamUrl RTSP stream URL to query.
     */
    constructor(public streamUrl: string) {
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateGetVideoFrameInputs(this);
    }
}
