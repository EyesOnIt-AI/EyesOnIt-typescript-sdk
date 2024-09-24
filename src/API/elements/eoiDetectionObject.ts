import { EOIBoundingBox } from "./eoiBoundingBox";

export class EOIDetectionObject {
    constructor(
        public object_description: string, 
        public confidence: number = 0, 
        public bounds?: EOIBoundingBox) { }

    public static fromJsonObj(obj: any) {
        return new EOIDetectionObject(
            obj.object_description,
            obj.confidence,
            EOIBoundingBox.fromJsonObj(obj.bounds));
    }
}