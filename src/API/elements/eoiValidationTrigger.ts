
export class EOIValidationTrigger {
    public class_name: string
    public start_seconds: number
    public end_seconds: number

    constructor() {
    }

    static fromJsonObj(obj: any): EOIValidationTrigger {
        let validation_trigger = new EOIValidationTrigger();

        validation_trigger.class_name = obj.class_name;
        validation_trigger.start_seconds = obj.start_seconds;
        validation_trigger.end_seconds = obj.end_seconds;

        return validation_trigger;
    }
}