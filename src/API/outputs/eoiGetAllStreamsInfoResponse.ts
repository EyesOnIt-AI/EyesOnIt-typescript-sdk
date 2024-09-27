import { EOIResponse } from "../eoiResponse";
import { EOIStreamInfo } from "../elements/eoiStreamInfo";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIGetAllStreamsInfoResponse extends EOIBaseOutputs {
    public streams: EOIStreamInfo[];
    
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.streams != null) {
                this.streams = eoiResponse.data.streams?.map(EOIStreamInfo.fromJsonObj);
            }
        }
    }
}