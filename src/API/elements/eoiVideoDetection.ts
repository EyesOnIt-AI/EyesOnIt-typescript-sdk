import { DateTime } from "luxon";
import { EOIDetectionCondition } from "./eoiDetectionCondition";
import { EOIDetectionObject } from "./eoiDetectionObject";
import { EOIDetection } from "./eoiDetection";


export class EOIVideoDetection extends EOIDetection {
    public stream_url?: string | null;
    public stream_name?: string | null;
    public event?: string | null;
    public time?: DateTime;
    public frame_num?: number | null;
    public object_description?: string | null;
    public condition?: EOIDetectionCondition;
    public total_count?: number | null;
    public result_id?: string | null;
    public image?: string | null;
    public alert_stream_id?: string | null;
    public alert_id?: string | null;
    public alert_rtsp_url?: string | null;

    constructor() {
        super();
    }

    public static fromJsonObj(obj: any): EOIVideoDetection | undefined {
        let detection;

        if (obj != null) {
            detection = new EOIVideoDetection();
            detection.parseSuperClassFields(obj);

            detection.stream_url = obj.stream_url;
            detection.stream_name = obj.stream_name;
            detection.event = obj.event;
            detection.time = obj.time != null ? DateTime.fromISO(obj.time) : undefined;
            detection.frame_num = obj.frame_num;
            detection.object_description = obj.object_description;
            detection.total_count = obj.total_count;
            detection.result_id = obj.result_id;
            detection.image = obj.image;
            detection.alert_stream_id = obj.alert_stream_id;
            detection.alert_id = obj.alert_id;
            detection.alert_rtsp_url = obj.alert_rtsp_url;
            detection.condition = EOIDetectionCondition.fromJsonObj(obj.condition);
        }

        return detection;
    }

    public getDetectedObjects(): EOIDetectionObject[] | null {
        return this.condition?.objects ?? null;
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
