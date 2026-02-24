import { EOIImageDetection } from "../elements/eoiImageDetection";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `processImage`.
 */
export class EOIProcessImageResponse extends EOIBaseOutputs {
    /**
     * Parsed image detections.
     */
    public detections: EOIImageDetection[];
    /**
     * Optional base64-encoded output image (often annotated).
     */
    public image: string;
    
    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.detections != null) {
                this.detections = eoiResponse.data.detections?.map(EOIImageDetection.fromJsonObj);
            }

            this.image = eoiResponse.data?.image;
        }
    }
}
