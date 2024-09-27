import { EOIDetection } from "../elements/eoiDetection";
import { EOIResponse } from "../eoiResponse";
import { EOIStreamInfo } from "../elements/eoiStreamInfo";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIProcessImageResponse extends EOIBaseOutputs {
    public detections: EOIDetection[];
    public image: string;
    
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.detections != null) {
                this.detections = eoiResponse.data.detections?.map(EOIDetection.fromJsonObj);
            }

            this.image = eoiResponse.data?.image;
        }
    }
}