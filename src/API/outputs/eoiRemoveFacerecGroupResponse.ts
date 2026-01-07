import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIRemoveFacerecGroupResponse extends EOIBaseOutputs {
    public group_id: string;
    public removed_memberships: number;

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