import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

/**
 * Request payload for starting monitoring on a stream.
 */
export class EOIMonitorStreamInputs {
    /**
     * @param streamId Existing stream identifier to monitor.
     * @param durationSeconds Optional duration in seconds. Use `null` for no explicit timeout.
     */
    constructor(public streamId: string, public durationSeconds: number | null) {
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateMonitorStreamInputs(this);
    }
}
