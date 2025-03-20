import { EOIBoundingBox } from "./eoiBoundingBox";

export class EOIDetectionObject {
    constructor(
        public description_confidence: Map<string, number>, 
        public bounds?: EOIBoundingBox) { }

    public static fromJsonObj(obj: any) {
        return new EOIDetectionObject(
            obj.description_confidence,
            EOIBoundingBox.fromJsonObj(obj.bounds));
    }

    public getMaxConfidenceDescription(): [string, number] | null {
        let maxConfidence = -1;
        let maxConfidenceDescription: string | null = null;

        for (const [description, confidence] of Object.entries(this.description_confidence)) {
            if (confidence > maxConfidence) {
                maxConfidence = confidence;
                maxConfidenceDescription = description;
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