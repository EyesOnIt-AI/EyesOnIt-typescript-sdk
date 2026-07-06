import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `addStream`.
 */
export class EOIAddStreamResponse extends EOIBaseOutputs {
    /**
     * Canonical identifier for the added stream.
     */
    public stream_id?: string;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            this.stream_id = eoiResponse.data?.stream_id;
        }
    }
}
