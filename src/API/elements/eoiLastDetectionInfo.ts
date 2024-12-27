import { DateTime } from "luxon";

export class EOILastDetectionInfo {
    public image: string;
    public description_values: Map<string, number>;
    public alerting_description: string;
    public alert_time: DateTime;
    
    constructor() { }

    public static fromJsonObj(obj: any): EOILastDetectionInfo {
        let lastDetectionInfo = new EOILastDetectionInfo();

        lastDetectionInfo.image = obj.image;
        lastDetectionInfo.alerting_description = obj.alerting_prompt;
        lastDetectionInfo.alert_time = DateTime.fromFormat(obj.alert_time, "yyyy-LL-dd HH:mm:ss");

        if (obj.prompt_values != null) {
            lastDetectionInfo.description_values = new Map<string, number>();

            for (var key in obj.prompt_values) {
                if (obj.prompt_values.hasOwnProperty(key)) {
                    lastDetectionInfo.description_values.set(key, obj.prompt_values[key]);
                }
            }
        }
        
        return lastDetectionInfo;
    }
}