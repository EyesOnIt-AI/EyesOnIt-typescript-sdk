import { EOIResponse } from "../eoiResponse";
import { EOIValidation } from "./eoiValidation";

export class EOIStopMonitoringStreamInputs {
    constructor(public streamUrl: string) {
    }

    public validate(): EOIResponse {
        return EOIValidation.validateStopMonitoringStreamInputs(this);
    }
}