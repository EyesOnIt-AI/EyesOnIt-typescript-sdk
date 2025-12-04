import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOIPreviewFrameInputs {
    constructor(public streamUrl: string) {
    }

    public validate(): EOIResponse {
        return EOIValidator.validateGetPreviewFrameInputs(this);
    }
}