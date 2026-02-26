import { EOIBoundingBox } from "./eoiBoundingBox";
import { EOIFaceDetectionObject } from "./eoiFaceDetectionObject";
import { EOIObjectDescription } from "./eoiObjectDescription";
import { EOISimilarityDetectionObject } from "./eoiSimilarityDetectionObject";

export class EOIDetectionObject {
    constructor(
        public object_descriptions: EOIObjectDescription[], 
        public detection_type: string,
        public class_confidence: number, 
        public class_name?: string | undefined,
        public bounds?: EOIBoundingBox,
        public image?: string,
        public face?: EOIFaceDetectionObject,
        public similarity?: EOISimilarityDetectionObject) { }
        
    public static fromJsonObj(obj: any) {
        let object_descriptions: EOIObjectDescription[] = [];

        if (obj.object_descriptions != null) {
            obj.object_descriptions.forEach((element: any) => {
                const object_description = EOIObjectDescription.fromJsonObj(element);
                object_descriptions.push(object_description);
            });
        }

        return new EOIDetectionObject(
            object_descriptions,
            obj.detection_type,
            obj.class_confidence,
            obj.class_name,
            EOIBoundingBox.fromJsonObj(obj.bounds),
            obj.image,
            EOIFaceDetectionObject.fromJsonObj(obj.face),
            EOISimilarityDetectionObject.fromJsonObj(obj.similarity)
        );
    }

    public getConfidenceForDescription(description: string): number | null {
        for (const object_description of this.object_descriptions) {
            if (object_description.text == description) {
                return object_description.confidence || null;
            }
        }

        return null;
    }

    public getMaxConfidenceDescription(): [string, number] | null {
        let maxConfidence = -1;
        let maxConfidenceDescription: string | null = null;

        for (const object_description of this.object_descriptions) {
            if (object_description.confidence && object_description.confidence > maxConfidence) {
                maxConfidence = object_description.confidence;
                maxConfidenceDescription = object_description.text;
            }
        }

        if (maxConfidenceDescription != null) {
            return [maxConfidenceDescription, maxConfidence]
        }
        else {
            return null;
        }
    }
}