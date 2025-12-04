import { EOINotification } from "../elements/eoiNotification";
import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOILiveSearchInputs {
    constructor(public class_name: string, 
        public object_description: string, 
        public alert_threshold: number, 
        public duration_seconds: number | undefined, 
        public notification: EOINotification | undefined) {
        
    }

    public static fromJsonObj(obj: any): EOILiveSearchInputs | null {
        let inputs = new EOILiveSearchInputs(obj.class_name, obj.object_description, obj.threshold, obj.duration_seconds, EOINotification.fromJsonObj(obj.notification));

        return EOIValidator.validateLiveSearchInputs(inputs).success ? inputs : null;
    }

    public validate(): EOIResponse {
        return EOIValidator.validateLiveSearchInputs(this);
    }
}