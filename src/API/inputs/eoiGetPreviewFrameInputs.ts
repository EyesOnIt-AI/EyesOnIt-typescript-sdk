import { EOIResponse } from "../eoiResponse";
import { EOIValidation } from "./eoiValidation";

export class EOIPreviewFrameInputs {
    constructor(public streamUrl: string) {
    }

    public validate(): EOIResponse {
        return EOIValidation.validateGetPreviewFrameInputs(this);
    }
}