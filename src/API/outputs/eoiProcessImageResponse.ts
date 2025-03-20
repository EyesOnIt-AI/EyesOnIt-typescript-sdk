import { EOIImageDetection } from "../elements/eoiImageDetection";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIProcessImageResponse extends EOIBaseOutputs {
    public detections: EOIImageDetection[];
    public image: string;
    
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