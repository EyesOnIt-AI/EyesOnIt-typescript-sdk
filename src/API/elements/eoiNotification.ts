import { EOIAlertDetection } from "./eoiAlertDetection";

export class EOINotification {
    public last_detection: EOIAlertDetection;
    public alerting: boolean;

    constructor(public image_notification: boolean, public phone_number: string | null = null) { }

    public static fromJsonObj(obj: any): EOINotification | undefined {
        let notification;
        
        if (obj != null) {
            notification = new EOINotification(
                obj.image_notification,
                obj.phone_number);

            if (obj.last_detection != null) {
                notification.last_detection = EOIAlertDetection.fromJsonObj(obj.last_detection);
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
                image_notification: this.image_notification
            };
        } else {
            return {
                image_notification: this.image_notification,
                phone_number: this.phone_number
            };
        }
    }
}