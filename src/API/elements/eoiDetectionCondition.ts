import { EOIDetectionObject } from "./eoiDetectionObject";

export class EOIDetectionCondition {
    constructor(
        public type: string,
        public count: number | null = null,
        public line_name: string | null = null,
        public alert_direction: string | null = null,
        public objects: EOIDetectionObject[] | null = null) { }

    public static fromJsonObj(obj: any): EOIDetectionCondition | undefined {
        let detection

        if (obj != null) {
            detection = new EOIDetectionCondition(
                obj.type,
                obj.count,
                obj.line_name,
                obj.alert_direction,
                Array.isArray(obj.objects)
                    ? obj.objects
                        .map(EOIDetectionObject.fromJsonObj)
                        .filter((detectionObject: EOIDetectionObject | undefined): detectionObject is EOIDetectionObject => detectionObject != null)
                    : null,
            );
        }

        return detection;
    }

    public getMaxConfidenceObject(): [string, number] | null {
        let maxConfidence = -1;
        let maxConfidenceDescription: string | null | undefined;

        if (this.objects != null) {
            for (const obj of this.objects) {
                let confidence = 0;
                let description: string | null | undefined;

                switch (obj.detection_type) {
                    case "class_name":
                        confidence = obj.class_confidence || 0;
                        description = obj.class_name || "";
                        break;
                    case "natural_language":
                        let response = obj.getMaxConfidenceDescription()

                        if (response != null) {
                            [description, confidence] = response;
                        }
                        break;
                    case "face_recognition":
                        confidence = obj.face?.confidence || 0;
                        description = obj.face?.person_display_name;
                        break
                    case "similarity":
                        confidence = obj.similarity?.confidence || 0;
                        description = "Similar person";
                        break;
                }

                if (confidence > maxConfidence) {
                    maxConfidence = confidence;
                    maxConfidenceDescription = description;
                }
            }
        }

        if (maxConfidenceDescription && maxConfidence > 0) {
            return [maxConfidenceDescription, maxConfidence]
        }
        else {
            return null;
        }
    }
}
