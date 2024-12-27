import { EOIResponse } from "../eoiResponse";
import { EOIValidation } from "./eoiValidation";

export class EOIMonitorStreamInputs {
    constructor(public streamUrl: string, public durationSeconds: number | null) {
    }

    public validate(): EOIResponse {
        return EOIValidation.validateMonitorStreamInputs(this);
    }
}