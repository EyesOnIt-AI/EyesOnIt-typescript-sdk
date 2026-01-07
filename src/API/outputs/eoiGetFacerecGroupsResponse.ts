import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIGetFacerecGroupsResponse extends EOIBaseOutputs {
    public groups: string[];
    
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.groups != null) {
                this.groups = eoiResponse.data.groups;
            }
        }
    }
}