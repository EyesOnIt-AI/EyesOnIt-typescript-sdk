import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Response wrapper for `getVideoStatus`.
 */
export class EOIGetVideoStatusResponse extends EOIBaseOutputs {
    /**
     * Raw video status payload returned by the server.
     */
    public video: any;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        this.video = eoiResponse.data?.video;
    }
}
