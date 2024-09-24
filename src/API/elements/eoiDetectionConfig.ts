import { EOIDetectionCondition } from "./eoiDetectionCondition";
import { EOILine } from "./eoiLine";
import { EOIObjectDescription } from "./eoiObjectDescription";

export class EOIDetectionConfig {
    public class_name?: string;
    public class_threshold?: number = 30;
    public object_size?: number = 100;
    public object_descriptions: EOIObjectDescription[];
    public conditions?: EOIDetectionCondition[];
    public lines?: EOILine[];
    public alert_seconds?: number = 0.1
    public reset_seconds?: number = 0.1;

    constructor(init?: Partial<EOIDetectionConfig>) { }

    public static fromJsonObj(obj: any) {
        let detection_config = new EOIDetectionConfig();
        detection_config.class_name = obj.class_name;
        detection_config.class_threshold = obj.class_threshold,
        detection_config.object_size = obj.object_size,
        detection_config.object_descriptions = obj.object_descriptions?.map(EOIObjectDescription.fromJsonObj),
        detection_config.conditions = obj.conditions?.map(EOIDetectionCondition.fromJsonObj),
        detection_config.lines = obj.lines?.map(EOILine.fromJsonObj),
        detection_config.alert_seconds = obj.alert_seconds,
        detection_config.reset_seconds = obj.reset_seconds;

        return detection_config;
    }
}