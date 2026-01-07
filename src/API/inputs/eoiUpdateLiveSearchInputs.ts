import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOIUpdateLiveSearchInputs {
    constructor(public search_id: number) {
        
    }

    public static fromJsonObj(obj: any): EOIUpdateLiveSearchInputs | null {
        let inputs = new EOIUpdateLiveSearchInputs(obj.search_id);

        return EOIValidator.validateUpdateLiveSearchInputs(inputs).success ? inputs : null;
    }

    public validate(): EOIResponse {
        return EOIValidator.validateUpdateLiveSearchInputs(this);
    }
}