import { EOIResponse } from "../eoiResponse";
import { EOIStreamInfo } from "../elements/eoiStreamInfo";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIGetStreamDetailsResponse extends EOIBaseOutputs {
    public stream: EOIStreamInfo;
    
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.stream != null) {
                this.stream = EOIStreamInfo.fromJsonObj(eoiResponse.data.stream);
            }
        }
    }
}