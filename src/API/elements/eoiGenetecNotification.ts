export class EOIGenetecNotification {
    public webhook_event_id?: number;
    public webhook_camera_uuid?: string;

    constructor() {
    }

    public static fromJsonObj(obj: any): EOIGenetecNotification | undefined {
        let genetecNotification = undefined;

        if (obj != null) {
            genetecNotification = new EOIGenetecNotification();
            genetecNotification.webhook_event_id = obj.webhook_event_id;
            genetecNotification.webhook_camera_uuid = obj.webhook_camera_uuid;
        }

        return genetecNotification;
    }
}
