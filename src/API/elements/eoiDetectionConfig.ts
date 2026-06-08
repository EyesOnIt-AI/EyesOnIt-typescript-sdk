import { EOIDetectionCondition } from "./eoiDetectionCondition";
import { EOIDetectionObject } from "./eoiDetectionObject";
import { EOIFaceRecognitionConfig } from "./eoiFaceRecognitionConfig";
import { EOIObjectDescription } from "./eoiObjectDescription";
import { EOISimilarityConfig } from "./eoiSimilarityConfig";
import { EOIVMSDetectionConfig } from "./VMS/eoiVMSDetectionConfig";

/**
 * Detection behavior for a region.
 * Configure class-based, natural-language, face-recognition, or similarity matching.
 */
export class EOIDetectionConfig {
    /**
     * Optional class filter (`person`, `vehicle`, `bag`, `animal`, `unknown`).
     */
    public class_name?: string | null;
    /**
     * Class confidence threshold used when `class_name` is set.
     */
    public class_threshold?: number | null = 10;
    /**
     * Minimum object size filter. Minimum is `100` when provided.
     */
    public object_size?: number = 100;
    /**
     * Minimum combined threshold for alerting. Default is 50.
     */
    public combined_threshold?: number | null = null;
    /**
     * Optional contour-area filter for motion/object extraction.
     */
    public min_contour_area?: number | null = null;
    /**
     * Optional upper bound for bounding-box area.
     */
    public max_bounding_box_area?: number | null = null;
    /**
     * Natural-language/object prompt list used for matching and alerting.
     */
    public object_descriptions: EOIObjectDescription[];
    /**
     * Face-recognition matching configuration.
     */
    public face_recognition: EOIFaceRecognitionConfig | undefined = undefined;
    /**
     * Similarity matching configuration.
     */
    public similarity: EOISimilarityConfig | undefined = undefined;
    /**
     * Optional detection conditions such as count and line-cross.
     */
    public conditions?: EOIDetectionCondition[];
    /**
     * Seconds detection must persist before alerting. Validator minimum: `0.1`.
     */
    public alert_seconds?: number = 0.1
    /**
     * Seconds before resetting alert state. Validator minimum: `0.1`.
     */
    public reset_seconds?: number = 0.1;
    /**
     * Optional object-level filters/labels for downstream matching logic.
     */
    public objects?: EOIDetectionObject[];
    /**
     * Optional VMS-specific detection configuration.
     */
    public vms_config?: EOIVMSDetectionConfig | undefined = undefined;

    /**
     * @param init Optional partial initialization object.
     */
    constructor(init?: Partial<EOIDetectionConfig>) { 
    }

    public static fromJsonObj(obj: any) {
        let detection_config = undefined;
        
        if (obj != null) {
            detection_config = new EOIDetectionConfig();
            detection_config.class_name = obj.class_name;
            detection_config.class_threshold = obj.class_threshold;
            detection_config.object_size = obj.object_size;
            detection_config.combined_threshold = obj.combined_threshold;
            detection_config.min_contour_area = obj.min_contour_area;
            detection_config.max_bounding_box_area = obj.max_bounding_box_area;
            detection_config.object_descriptions = Array.isArray(obj.object_descriptions)
                ? obj.object_descriptions
                    .map(EOIObjectDescription.fromJsonObj)
                    .filter((objectDescription: EOIObjectDescription | undefined): objectDescription is EOIObjectDescription => objectDescription != null)
                : [];
            detection_config.conditions = obj.conditions?.map(EOIDetectionCondition.fromJsonObj);
            detection_config.alert_seconds = obj.alert_seconds;
            detection_config.reset_seconds = obj.reset_seconds;
            detection_config.objects = Array.isArray(obj.objects)
                ? obj.objects
                    .map(EOIDetectionObject.fromJsonObj)
                    .filter((detectionObject: EOIDetectionObject | undefined): detectionObject is EOIDetectionObject => detectionObject != null)
                : undefined;
            detection_config.face_recognition = EOIFaceRecognitionConfig.fromJsonObj(obj.face_recognition);
            detection_config.similarity = EOISimilarityConfig.fromJsonObj(obj.similarity);
            detection_config.vms_config = EOIVMSDetectionConfig.fromJsonObj(obj.vms_config);
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
        detection_config.combined_threshold = null;
        detection_config.min_contour_area = null;
        detection_config.max_bounding_box_area = null;
        detection_config.object_descriptions = [];
        detection_config.alert_seconds = 5;
        detection_config.reset_seconds = 10;

        detection_config.conditions = [];

        return detection_config;
    }
}
