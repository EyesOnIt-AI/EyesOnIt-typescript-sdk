import { DateTime } from "luxon";

export class EOILastDetectionInfo {
    public image: string;
    public prompt_values: Map<string, number>;
    public alerting_prompt: string;
    public alert_time: DateTime;
    
    constructor() { }

    public static fromJsonObj(obj: any): EOILastDetectionInfo {
        let lastDetectionInfo = new EOILastDetectionInfo();

        lastDetectionInfo.image = obj.image;
        lastDetectionInfo.alerting_prompt = obj.alerting_prompt;
        lastDetectionInfo.alert_time = DateTime.fromFormat(obj.alert_time, "yyyy-LL-dd HH:mm:ss");

        if (obj.prompt_values != null) {
            lastDetectionInfo.prompt_values = new Map<string, number>();

            for (var key in obj.prompt_values) {
                if (obj.prompt_values.hasOwnProperty(key)) {
                    lastDetectionInfo.prompt_values.set(key, obj.prompt_values[key]);
                }
            }
        }
        
        return lastDetectionInfo;
    }
}