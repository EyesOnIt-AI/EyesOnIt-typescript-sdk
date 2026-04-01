import { EOIGenetecNotification } from "./eoiGenetecNotification";
import { EOILastDetectionInfo } from "./eoiLastDetectionInfo";

export class EOINotification {
    public last_detection: EOILastDetectionInfo;
    public alerting: boolean;
    public rest_url: string;
    public genetec: EOIGenetecNotification | undefined = undefined;
    public include_count: boolean = false;

    constructor(public phone_number: string | null = null, public include_image: boolean
    ) { }

    public static fromJsonObj(obj: any): EOINotification | undefined {
        let notification;

        if (obj != null) {
            notification = new EOINotification(
                obj.phone_number,
                obj.include_image);
            notification.include_count = obj.include_count === true;

            if (obj.rest_url != null) {
                notification.rest_url = obj.rest_url;
            }

            notification.genetec = EOIGenetecNotification.fromJsonObj(obj.genetec);
    
            if (obj.last_detection != null) {
                notification.last_detection = EOILastDetectionInfo.fromJsonObj(obj.last_detection);
            }

            if (obj.alerting != null) {
                notification.alerting = obj.alerting;
            }
        }

        return notification;
    }

    public toJSON() {
        if (this.phone_number == null || this.phone_number.trim().length == 0) {
            const payload: any = {
                include_image: this.include_image,
                include_count: this.include_count
            };

            if (this.genetec != null) {
                payload.genetec = this.genetec;
            }

            if (this.rest_url != null) {
                payload.rest_url = this.rest_url;
            }

            return payload;
        } else {
            const payload: any = {
                include_image: this.include_image,
                phone_number: this.phone_number,
                include_count: this.include_count
            };

            if (this.genetec != null) {
                payload.genetec = this.genetec;
            }

            if (this.rest_url != null) {
                payload.rest_url = this.rest_url;
            }

            return payload;
        }
    }
}
