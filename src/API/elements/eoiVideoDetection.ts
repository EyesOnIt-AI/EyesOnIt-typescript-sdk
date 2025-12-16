import { DateTime } from "luxon";
import { EOIDetectionCondition } from "./eoiDetectionCondition";
import { EOIDetectionObject } from "./eoiDetectionObject";
import { EOIDetection } from "./eoiDetection";


export class EOIVideoDetection extends EOIDetection {
    public stream_url: string;
    public stream_name: string;
    public event: string;
    public time: DateTime;
    public frame_num: number;
    public object_description: string;
    public condition?: EOIDetectionCondition;
    public result_id?: string;

    constructor() {
        super();
    }

    public static fromJsonObj(obj: any): EOIVideoDetection | undefined {
        let detection;

        if (obj != null) {
            detection = new EOIVideoDetection();
            detection.parseSuperClassFields(obj);

            detection.stream_url = obj.stream_url;
            detection.time = obj.time;
            detection.result_id = obj.result_id;
            detection.condition = EOIDetectionCondition.fromJsonObj(obj.condition);
        }

        return detection;
    }

    public getDetectedObjects(): EOIDetectionObject[] | null {
        if (this.condition != null) {
            return this.condition.objects;
        }
        else {
            return null;
        }
    }

    public getMaxConfidenceDescription(): string | null {
        let maxConfidence = 0;
        let maxConfidenceDescription = null;

        if (this.condition?.objects) {
            for (let object of this.condition.objects) {
                let response = object.getMaxConfidenceDescription();

                if (response != null) {
                    let [description, confidence] = response;

                    if (confidence > maxConfidence) {
                        maxConfidence = confidence;
                        maxConfidenceDescription = description;
                    }
                }
            }
        }

        return maxConfidenceDescription;
    }
}