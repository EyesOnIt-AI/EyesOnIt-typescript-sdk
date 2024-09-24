import { DateTime } from "luxon";
import { EOIDetectionCondition } from "./eoiDetectionCondition";
import { EOIDetectionObject } from "./eoiDetectionObject";


export class EOIDetection {
    public stream_url: string;
    public region: string;
    public time: DateTime;
    public class_name?: string;
    public condition?: EOIDetectionCondition;
    public objects: EOIDetectionObject[];

    constructor() {
    }

    public static fromJsonObj(obj: any): EOIDetection | undefined {
        let detection;

        if (obj != null) {
            detection = new EOIDetection();
            detection.stream_url = obj.stream_url;
            detection.region = obj.region;
            detection.time = obj.time;
            detection.class_name = obj.class_name;
            detection.condition = EOIDetectionCondition.fromJsonObj(obj.condition);
            detection.objects = obj.objects?.map(EOIDetectionObject.fromJsonObj);
        }

        return detection;
    }

    public getDetectedObjects(): EOIDetectionObject[] {
        if (this.condition != null) {
            return this.condition.objects;
        }
        else {
            return this.objects;
        }
    }

    public getObjectByDescription(object_description: string): EOIDetectionObject | undefined {
        let objects = this.getDetectedObjects();

        if (objects != null) {
            for (var obj of objects) {
                if (obj.object_description == object_description) {
                    return obj;
                }
            }
        }

        return undefined;
    }
}