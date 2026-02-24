import { EOIResponse } from "../eoiResponse";
import { EOIStreamInfo } from "../elements/eoiStreamInfo";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `getStreamDetails`.
 */
export class EOIGetStreamDetailsResponse extends EOIBaseOutputs {
    /**
     * Stream details for the requested stream.
     */
    public stream: EOIStreamInfo;
    
    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.stream != null) {
                this.stream = EOIStreamInfo.fromJsonObj(eoiResponse.data.stream);
            }
        }
    }
}
