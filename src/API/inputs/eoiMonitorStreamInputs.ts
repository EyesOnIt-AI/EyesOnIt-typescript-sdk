import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOIMonitorStreamInputs {
    constructor(public streamUrl: string, public durationSeconds: number | null) {
    }

    public validate(): EOIResponse {
        return EOIValidator.validateMonitorStreamInputs(this);
    }
}