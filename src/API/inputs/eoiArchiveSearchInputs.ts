import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";
import { EOISearchInputs } from "./eoiSearchInputs";

export class EOIArchiveSearchInputs extends EOISearchInputs {
    public start_date_time: string;
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

    public validate(): EOIResponse {
        return EOIValidator.validateArchiveSearchInputs(this);
    }
}