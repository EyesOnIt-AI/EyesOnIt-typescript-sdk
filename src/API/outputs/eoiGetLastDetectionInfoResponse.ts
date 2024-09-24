import { EOIDetection } from "../elements/eoiDetection";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIGetLastDetectionInfoResponse extends EOIBaseOutputs {
    public image: string;
    public detections: EOIDetection[];
    
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            this.image = eoiResponse.data?.image;

            if (eoiResponse.data?.detections != null) {
                this.detections = eoiResponse.data?.detections.map(EOIDetection.fromJsonObj);
            }
        }
    }
}