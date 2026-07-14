import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `processVideo`.
 */
export class EOIProcessVideoResponse extends EOIBaseOutputs {

    /**
     * Identifier for the asynchronous video-processing job.
    */
    public video_id: string;

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
