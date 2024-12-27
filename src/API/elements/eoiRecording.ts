export class EOIRecording {
    constructor(
        public enabled: boolean, 
        public save_with_alert: boolean, 
        public save_full_frame: boolean, 
        public save_object_bounds: boolean, 
        public save_video: boolean, 
        public save_image: boolean, 
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
                obj.save_full_frame,
                obj.save_object_bounds,
                obj.save_video,
                obj.save_image,
                obj.save_with_detection,
                obj.save_with_motion,
                obj.save_original_copy,
                obj.recording_folder);
        }

        return recording;
    }
}