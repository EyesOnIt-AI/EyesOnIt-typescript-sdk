import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIGetVideoFrameResponse extends EOIBaseOutputs {
    public image: string;
    
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            this.image = eoiResponse.data?.image;
        }
    }
}