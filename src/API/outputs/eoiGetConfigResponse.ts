import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Response wrapper for `getConfig`.
 */
export class EOIGetConfigResponse extends EOIBaseOutputs {
    /**
     * Raw configuration payload returned by the server.
     */
    public config: any;

    /**
     * Alias for the raw configuration payload.
     */
    public data: any;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        this.config = eoiResponse.data;
        this.data = eoiResponse.data;
    }
}
