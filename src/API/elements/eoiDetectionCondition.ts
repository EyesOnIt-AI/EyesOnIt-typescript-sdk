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
                obj.objects?.map(EOIDetectionObject.fromJsonObj),
            );
        }

        return detection;
    }
}