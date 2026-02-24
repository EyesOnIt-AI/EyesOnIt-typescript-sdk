import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `getFacerecGroups`.
 */
export class EOIGetFacerecGroupsResponse extends EOIBaseOutputs {
    /**
     * Face recognition group IDs.
     */
    public groups: string[];
    
    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.groups != null) {
                this.groups = eoiResponse.data.groups;
            }
        }
    }
}
