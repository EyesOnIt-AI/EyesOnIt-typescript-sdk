import { EOIDetectionObject } from "./eoiDetectionObject";

export class EOIDetectionCondition {
    constructor(
        public type: string, 
        public count: number = 0, 
        public line_name: string, 
        public alert_side: string, 
        public objects: EOIDetectionObject[]) { }

    public static fromJsonObj(obj: any): EOIDetectionCondition | undefined {
        let detection

        if (obj != null) {
            detection = new EOIDetectionCondition(
                obj.type,
                obj.count,
                obj.line_name,
                obj.alert_side,
                obj.objects?.map(EOIDetectionObject.fromJsonObj),
            );
        }

        return detection;
    }
}