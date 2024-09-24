export class EOIRecording {
    constructor(
        public enabled: boolean, 
        public save_with_alert: boolean, 
        public save_with_detection: boolean, 
        public save_with_motion: boolean, 
        public save_original_copy: boolean, 
        public recording_folder: string) { }

    public static fromJsonObj(obj: any) {
        let recording;

        if (obj != null) {
            recording = new EOIRecording(
                obj.enabled,
                obj.save_with_alert,
                obj.save_with_detection,
                obj.save_with_motion,
                obj.save_original_copy,
                obj.recording_folder);
        }

        return recording;
    }
}