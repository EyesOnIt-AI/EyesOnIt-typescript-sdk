import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `getVideoFrame`.
 */
export class EOIGetVideoFrameResponse extends EOIBaseOutputs {
    /**
     * Base64-encoded image for the returned frame.
     */
    public image: string;
    
    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            this.image = eoiResponse.data?.image;
        }
    }
}
