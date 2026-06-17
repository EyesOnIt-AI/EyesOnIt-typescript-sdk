import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Response wrapper for `stopVideo`.
 */
export class EOIStopVideoResponse extends EOIBaseOutputs {
    /**
     * Video identifier that was stopped. `null` means the request targeted all active videos.
     */
    public video_id?: string | null;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        this.video_id = eoiResponse.data?.video_id;
    }
}
