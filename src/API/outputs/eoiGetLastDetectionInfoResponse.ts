import { EOIVideoDetection } from "../elements/eoiVideoDetection";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `getLastDetectionInfo`.
 */
export class EOIGetLastDetectionInfoResponse extends EOIBaseOutputs {
    /**
     * Optional base64-encoded image for the last detection frame.
     */
    public image: string;
    /**
     * Parsed detections from the last detection event.
     */
    public detections: EOIVideoDetection[];
    
    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            this.image = eoiResponse.data?.image;

            if (eoiResponse.data?.detections != null) {
                this.detections = eoiResponse.data?.detections?.map(EOIVideoDetection.fromJsonObj);
            }
        }
    }
}
