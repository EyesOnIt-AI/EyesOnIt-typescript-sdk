import { EOILastDetectionInfo } from "./eoiLastDetectionInfo";

export class EOINotification {
    public last_detection: EOILastDetectionInfo;
    public alerting: boolean;
    public rest_url: string;

    constructor(public phone_number: string | null = null, public include_image: boolean
    ) { }

    public static fromJsonObj(obj: any): EOINotification | undefined {
        let notification;

        if (obj != null) {
            notification = new EOINotification(
                obj.phone_number,
                obj.include_image);

            if (obj.rest_url != null) {
                notification.rest_url = obj.rest_url;
            }
    
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
            return {
                include_image: this.include_image
            };
        } else {
            return {
                include_image: this.include_image,
                phone_number: this.phone_number
            };
        }
    }
}