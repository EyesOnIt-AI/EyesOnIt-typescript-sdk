import { EOIResponse } from "../eoiResponse";
import { EOIStreamInfo } from "../elements/eoiStreamInfo";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `getAllStreamsInfo`.
 */
export class EOIGetAllStreamsInfoResponse extends EOIBaseOutputs {
    /**
     * All registered streams returned by the server.
     */
    public streams: EOIStreamInfo[];
    
    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.streams != null) {
                this.streams = eoiResponse.data.streams?.map(EOIStreamInfo.fromJsonObj);
            }
        }
    }
}
