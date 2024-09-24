import { EOIResponse } from "../eoiResponse";
import { EOIValidation } from "./eoiValidation";

export class EOIRemoveStreamInputs {
    constructor(public streamUrl: string) {
    }

    public validate(): EOIResponse {
        return EOIValidation.validateRemoveStreamInputs(this);
    }
}