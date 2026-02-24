import { EOIDetectionCondition } from "./eoiDetectionCondition";
import { EOIDetectionObject } from "./eoiDetectionObject";
import { EOIFaceRecognitionConfig } from "./eoiFaceRecognitionConfig";
import { EOIObjectDescription } from "./eoiObjectDescription";
import { EOISimilarityConfig } from "./eoiSimilarityConfig";

export class EOIDetectionConfig {
    public class_name?: string | null;
    public class_threshold?: number | null = 10;
    public object_size?: number = 100;
    public min_contour_area?: number | null = null;
    public max_bounding_box_area?: number | null = null;
    public detection_type: string | null = null;            // class_name, natural_language, face_recognition, similarity
    public object_descriptions: EOIObjectDescription[];
    public face_recognition: EOIFaceRecognitionConfig | undefined = undefined;
    public similarity: EOISimilarityConfig | undefined = undefined;
    public conditions?: EOIDetectionCondition[];
    public alert_seconds?: number = 0.1
    public reset_seconds?: number = 0.1;
    public objects?: EOIDetectionObject[];

    constructor(init?: Partial<EOIDetectionConfig>) { 
    }

    public static fromJsonObj(obj: any) {
        let detection_config = undefined;
        
        if (obj != null) {
            detection_config = new EOIDetectionConfig();
            detection_config.class_name = obj.class_name;
            detection_config.class_threshold = obj.class_threshold;
            detection_config.object_size = obj.object_size;
            detection_config.min_contour_area = obj.min_contour_area;
            detection_config.max_bounding_box_area = obj.max_bounding_box_area;
            detection_config.detection_type = obj.detection_type;
            detection_config.object_descriptions = obj.object_descriptions?.map(EOIObjectDescription.fromJsonObj);
            detection_config.conditions = obj.conditions?.map(EOIDetectionCondition.fromJsonObj);
            detection_config.alert_seconds = obj.alert_seconds;
            detection_config.reset_seconds = obj.reset_seconds;
            detection_config.objects = obj.objects?.map(EOIDetectionObject.fromJsonObj);
            detection_config.face_recognition = EOIFaceRecognitionConfig.fromJsonObj(obj.face_recognition);
            detection_config.similarity = EOISimilarityConfig.fromJsonObj(obj.similarity);
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
        detection_config.min_contour_area = null;
        detection_config.max_bounding_box_area = null;
        detection_config.detection_type = "class_name";
        detection_config.object_descriptions = [];
        detection_config.alert_seconds = 5;
        detection_config.reset_seconds = 10;

        detection_config.conditions = [];

        return detection_config;
    }
}