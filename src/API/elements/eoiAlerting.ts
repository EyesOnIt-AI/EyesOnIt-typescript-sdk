import { EOIAlertDetection } from "./eoiAlertDetection";

export class EOIAlerting {
    public last_detection: EOIAlertDetection;
    public alerting: boolean;

    constructor(public image_notification: boolean, public phone_number: string | null = null) { }

    public static fromJsonObj(obj: any): EOIAlerting | undefined {
        let alerting;
        
        if (obj != null) {
            alerting = new EOIAlerting(
                obj.alert_seconds_count,
                obj.reset_seconds_count);

            if (obj.last_detection != null) {
                alerting.last_detection = EOIAlertDetection.fromJsonObj(obj.last_detection);
            }

            if (obj.alerting != null) {
                alerting.alerting = obj.alerting;
            }
        }

        return alerting;
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