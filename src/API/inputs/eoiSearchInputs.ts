import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOISearchInputs {
    constructor(public class_name: string, 
        public object_description: string, 
        public start_date_time: string, 
        public end_date_time: string) {
        
    }

    public static fromJsonObj(obj: any): EOISearchInputs | null {
        let inputs = new EOISearchInputs(obj.class_name, obj.object_description, obj.start_date_time, obj.end_date_time);

        return EOIValidator.validateSearchInputs(inputs).success ? inputs : null;
    }

    public validate(): EOIResponse {
        return EOIValidator.validateSearchInputs(this);
    }
}