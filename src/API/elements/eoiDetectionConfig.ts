import { EOIDetectionCondition } from "./eoiDetectionCondition";
import { EOIObjectDescription } from "./eoiObjectDescription";

export class EOIDetectionConfig {
    public class_name?: string | null;
    public class_threshold?: number | null = 10;
    public object_size?: number = 100;
    public object_descriptions: EOIObjectDescription[];
    public conditions?: EOIDetectionCondition[];
    public alert_seconds?: number = 0.1
    public reset_seconds?: number = 0.1;

    constructor(init?: Partial<EOIDetectionConfig>) { 
    }

    public static fromJsonObj(obj: any) {
        let detection_config = undefined;
        
        if (obj != null) {
            detection_config = new EOIDetectionConfig();
            detection_config.class_name = obj.class_name;
            detection_config.class_threshold = obj.class_threshold,
            detection_config.object_size = obj.object_size,
            detection_config.object_descriptions = obj.object_descriptions?.map(EOIObjectDescription.fromJsonObj),
            detection_config.conditions = obj.conditions?.map(EOIDetectionCondition.fromJsonObj),
            detection_config.alert_seconds = obj.alert_seconds,
            detection_config.reset_seconds = obj.reset_seconds;
        }
        else {
            detection_config = EOIDetectionConfig.default();
        }

        return detection_config;
    }

    public static default(): EOIDetectionConfig {
        let detection_config = new EOIDetectionConfig();
        detection_config.class_name = null;
        detection_config.class_threshold = null;
        detection_config.object_size = 100;
        detection_config.object_descriptions = [];
        detection_config.alert_seconds = 5;
        detection_config.reset_seconds = 10;

        detection_config.conditions = [];

        return detection_config;
    }
}