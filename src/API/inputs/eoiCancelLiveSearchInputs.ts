import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOICancelLiveSearchInputs {
    constructor(public search_id: number) {
        
    }

    public static fromJsonObj(obj: any): EOICancelLiveSearchInputs | null {
        let inputs = new EOICancelLiveSearchInputs(obj.search_id);

        return EOIValidator.validateCancelLiveSearchInputs(inputs).success ? inputs : null;
    }

    public validate(): EOIResponse {
        return EOIValidator.validateCancelLiveSearchInputs(this);
    }
}