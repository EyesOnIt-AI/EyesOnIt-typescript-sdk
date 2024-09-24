import { DateTime } from "luxon";

export class EOIAlertDetection {
    
    constructor(public prompt_values: [], public alerting_prompt: string, public alert_time: DateTime) { }

    public static fromJsonObj(obj: any): EOIAlertDetection {
        return obj as EOIAlertDetection;
    }
}