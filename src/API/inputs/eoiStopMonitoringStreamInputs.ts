import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

/**
 * Request payload for stopping monitoring on a stream.
 */
export class EOIStopMonitoringStreamInputs {
    /**
     * @param streamUrl RTSP stream URL to stop monitoring.
     */
    constructor(public streamUrl: string) {
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateStopMonitoringStreamInputs(this);
    }
}
