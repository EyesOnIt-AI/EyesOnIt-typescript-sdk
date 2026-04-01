export class EOIGenetecDetectionConfig {
    public webhook_event_id: number;

    constructor() {
    }

    public static fromJsonObj(obj: any): EOIGenetecDetectionConfig | undefined {
        let genetecDetectionConfig = undefined;

        if (obj != null) {
            genetecDetectionConfig = new EOIGenetecDetectionConfig();
            genetecDetectionConfig.webhook_event_id = obj.webhook_event_id;
        }

        return genetecDetectionConfig;
    }
}
