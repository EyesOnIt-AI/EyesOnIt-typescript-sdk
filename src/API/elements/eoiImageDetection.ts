import { EOIDetectionObject } from "./eoiDetectionObject";
import { EOIDetection } from "./eoiDetection";


export class EOIImageDetection extends EOIDetection {
    public objects: EOIDetectionObject[];

    constructor() {
        super();
    }

    public static fromJsonObj(obj: any): EOIDetection | undefined {
        let detection;

        if (obj != null) {
            detection = new EOIImageDetection();
            detection.parseSuperClassFields(obj);
            detection.objects = obj.objects?.map(EOIDetectionObject.fromJsonObj);
        }

        return detection;
    }

    public getDetectedObjects(): EOIDetectionObject[] | null {
        return this.objects;
    }

    public getMaxConfidenceDescription(): string | null {
        let maxConfidence = 0;
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