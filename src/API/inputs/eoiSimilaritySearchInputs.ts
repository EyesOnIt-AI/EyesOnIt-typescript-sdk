import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOISimilaritySearchInputs {
    constructor(public seed_id: string | undefined) {
        
    }

    public static fromJsonObj(obj: any): EOISimilaritySearchInputs | null {
        let inputs = new EOISimilaritySearchInputs(obj.seed_id);

        return EOIValidator.validateSimilaritySearchInputs(inputs).success ? inputs : null;
    }

    public validate(): EOIResponse {
        return EOIValidator.validateSimilaritySearchInputs(this);
    }
}