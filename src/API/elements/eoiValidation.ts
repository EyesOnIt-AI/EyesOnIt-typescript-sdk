import { EOIValidationTrigger } from "./eoiValidationTrigger";

export class EOIValidation {
    public triggers: EOIValidationTrigger[]

    constructor() {
    }

    static fromJsonObj(obj: any): EOIValidation {
        let validation = new EOIValidation();

        validation.triggers = obj.triggers?.map(EOIValidationTrigger.fromJsonObj);

        return validation;
    }
}