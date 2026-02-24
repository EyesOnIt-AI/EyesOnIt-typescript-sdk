import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";
import { EOISearchInputs } from "./eoiSearchInputs";

/**
 * Request payload for archive search queries.
 */
export class EOIArchiveSearchInputs extends EOISearchInputs {
    /**
     * Optional inclusive start timestamp in ISO format.
     * Must be on or after `2020-01-01T00:00:00Z`.
     */
    public start_date_time: string;
    /**
     * Optional exclusive end timestamp in ISO format.
     * Must be on or after `2020-01-01T00:00:00Z` and after `start_date_time`.
     */
    public end_date_time: string;

    constructor() {
        super();
    }

    public static fromJsonObj(obj: any): EOIArchiveSearchInputs | null {
        let inputs = new EOIArchiveSearchInputs();

        inputs.start_date_time = obj.start_date_time;
        inputs.end_date_time = obj.end_date_time;

        inputs.setBaseProperties(obj);

        return EOIValidator.validateArchiveSearchInputs(inputs).success ? inputs : null;
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateArchiveSearchInputs(this);
    }
}
