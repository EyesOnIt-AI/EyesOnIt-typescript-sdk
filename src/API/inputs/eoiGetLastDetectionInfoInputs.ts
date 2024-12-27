import { EOIResponse } from "../eoiResponse";
import { EOIValidation } from "./eoiValidation";

export class EOIGetLastDetectionInfoInputs {
    constructor(public streamUrl: string) {
    }

    public validate(): EOIResponse {
        return EOIValidation.validateGetLastDetectionInfoInputs(this);
    }
}