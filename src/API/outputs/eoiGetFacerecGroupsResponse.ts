import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

export interface EOIFacerecGroupSummary {
    id?: number;
    external_id: string;
    display_name: string;
    description?: string | null;
    remote_managed?: boolean;
    managed_by?: string;
}

/**
 * Response wrapper for `getFacerecGroups`.
 */
export class EOIGetFacerecGroupsResponse extends EOIBaseOutputs {
    /**
     * Face recognition groups.
     */
    public groups: Array<EOIFacerecGroupSummary | string> = [];
    
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
