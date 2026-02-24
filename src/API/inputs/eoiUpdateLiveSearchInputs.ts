import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

/**
 * Request payload used to pause, resume, or cancel a live search.
 */
export class EOIUpdateLiveSearchInputs {
    /**
     * @param search_id Search ID to target. Use `-1` to target all active searches.
     */
    constructor(public search_id: number) {
        
    }

    public static fromJsonObj(obj: any): EOIUpdateLiveSearchInputs | null {
        let inputs = new EOIUpdateLiveSearchInputs(obj.search_id);

        return EOIValidator.validateUpdateLiveSearchInputs(inputs).success ? inputs : null;
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateUpdateLiveSearchInputs(this);
    }
}
