import { EOINotification } from "../elements/eoiNotification";
import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";
import { EOISearchInputs } from "./eoiSearchInputs";

export class EOILiveSearchInputs extends EOISearchInputs {
    public duration_seconds: number | undefined;
    public notification: EOINotification | undefined;

    constructor() {
        super()
    }

    public static fromJsonObj(obj: any): EOILiveSearchInputs | null {
        let inputs = new EOILiveSearchInputs();

        inputs.duration_seconds = obj.duration_seconds;
        inputs.notification = EOINotification.fromJsonObj(obj.notification);

        inputs.setBaseProperties(obj);

        return EOIValidator.validateLiveSearchInputs(inputs).success ? inputs : null;
    }

    public validate(): EOIResponse {
        return EOIValidator.validateLiveSearchInputs(this);
    }
}