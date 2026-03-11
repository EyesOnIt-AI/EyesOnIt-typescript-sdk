import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `processVideo`.
 */
export class EOIProcessVideoResponse extends EOIBaseOutputs {

    /**
     * Optional base64-encoded output image (often annotated).
    */
    public video_id: number;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            this.video_id = eoiResponse.data?.video_id;
        }
    }
}
