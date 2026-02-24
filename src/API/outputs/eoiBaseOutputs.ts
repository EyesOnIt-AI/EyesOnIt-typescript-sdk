import { EOIResponse } from "../eoiResponse";


/**
 * Base shape for SDK response wrappers.
 */
export class EOIBaseOutputs {
    /**
     * Indicates whether the API call completed successfully.
     */
    public success: boolean;
    /**
     * Optional human-readable message returned by the API.
     */
    public message?: string;

    /**
     * @param eoiResponse Raw API response to map into typed output fields.
     */
    constructor(eoiResponse: EOIResponse) {
        this.success = eoiResponse.success;
        this.message = eoiResponse.message;
    }
}
