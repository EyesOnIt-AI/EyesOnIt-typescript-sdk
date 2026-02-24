import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `monitorStream`.
 */
export class EOIMonitorStreamResponse extends EOIBaseOutputs {
    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
    }
}
