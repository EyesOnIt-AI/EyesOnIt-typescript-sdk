import { EOIDetectionObject } from "./eoiDetectionObject";
import { EOIDetection } from "./eoiDetection";


export class EOIImageDetection extends EOIDetection {
    public objects: EOIDetectionObject[] = [];

    constructor() {
        super();
    }

    public static fromJsonObj(obj: any): EOIDetection | undefined {
        let detection;

        if (obj != null) {
            detection = new EOIImageDetection();
            detection.parseSuperClassFields(obj);
            detection.objects = Array.isArray(obj.objects)
                ? obj.objects
                    .map(EOIDetectionObject.fromJsonObj)
                    .filter((detectionObject: EOIDetectionObject | undefined): detectionObject is EOIDetectionObject => detectionObject != null)
                : [];
        }

        return detection;
    }

    public getDetectedObjects(): EOIDetectionObject[] | null {
        return this.objects;
    }

    public getMaxConfidenceForDescription(description: string): number | null {
        let maxConfidence: number | null = null;

        for (let object of this.objects) {
            let confidence = object.getConfidenceForDescription(description);

            if (confidence != null) {
                if (!maxConfidence || confidence > maxConfidence) {
                    maxConfidence = confidence;
                }
            }
        }

        return maxConfidence;
    }

    public getMaxConfidenceDescription(): string | null {
        let maxConfidence = -1;
        let maxConfidenceDescription = null;

        for (let object of this.objects) {
            let response = object.getMaxConfidenceDescription();

            if (response != null) {
                let [description, confidence] = response;

                if (confidence > maxConfidence) {
                    maxConfidence = confidence;
                    maxConfidenceDescription = description;
                }
            }
        }

        return maxConfidenceDescription;
    }
}
