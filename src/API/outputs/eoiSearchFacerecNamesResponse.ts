import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

export class EOISearchFacerecNamesResult {
    public external_id: string;
    public display_name: string;
}

export class EOISearchFacerecNamesResponse extends EOIBaseOutputs {
    public matches: EOISearchFacerecNamesResult[];

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.matches != null) {
                this.matches = eoiResponse.data.matches;
            }
        }
    }
}