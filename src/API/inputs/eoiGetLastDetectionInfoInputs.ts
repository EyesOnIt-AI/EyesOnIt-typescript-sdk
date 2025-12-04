import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOIGetLastDetectionInfoInputs {
    constructor(public streamUrl: string) {
    }

    public validate(): EOIResponse {
        return EOIValidator.validateGetLastDetectionInfoInputs(this);
    }
}