import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

/**
 * Request payload for removing a registered stream.
 */
export class EOIRemoveStreamInputs {
    /**
     * @param streamUrl RTSP stream URL to remove.
     */
    constructor(public streamUrl: string) {
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateRemoveStreamInputs(this);
    }
}
