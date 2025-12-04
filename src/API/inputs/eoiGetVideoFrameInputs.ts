import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOIVideoFrameInputs {
    constructor(public streamUrl: string) {
    }

    public validate(): EOIResponse {
        return EOIValidator.validateGetVideoFrameInputs(this);
    }
}