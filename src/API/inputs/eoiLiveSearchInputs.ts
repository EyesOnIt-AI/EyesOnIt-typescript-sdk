import { EOINotification } from "../elements/eoiNotification";
import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";
import { EOISearchInputs } from "./eoiSearchInputs";

/**
 * Request payload for launching a live search operation.
 */
export class EOILiveSearchInputs extends EOISearchInputs {
    /**
     * Optional duration (seconds) for the live search.
     * Use `undefined` for server-default behavior.
     */
    public duration_seconds: number | undefined;
    /**
     * Optional notification settings (for example phone alerting).
     */
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

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateLiveSearchInputs(this);
    }
}
