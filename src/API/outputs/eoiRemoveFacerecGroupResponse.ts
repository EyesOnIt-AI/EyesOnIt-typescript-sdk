import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `removeFacerecGroup`.
 */
export class EOIRemoveFacerecGroupResponse extends EOIBaseOutputs {
    /**
     * Removed group identifier.
     */
    public group_id: string;
    /**
     * Number of person-group memberships removed as part of this operation.
     */
    public removed_memberships: number;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.group_id != null) {
                this.group_id = eoiResponse.data.group_id;
            }

            if (eoiResponse.data?.removed_memberships != null) {
                this.removed_memberships = eoiResponse.data.removed_memberships;
            }
        }
    }
}
