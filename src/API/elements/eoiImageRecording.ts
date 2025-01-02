export class EOIImageRecording {
    constructor(
        public enabled: boolean,
        public record_full_frame: boolean,
        public record_object_bounds: boolean,
        public record_all_frames: boolean,
        public frame_record_interval: number,
    ) { }

    public static fromJsonObj(obj: any) {
        let image_recording;

        if (obj != null) {
            image_recording = new EOIImageRecording(
                obj.enabled,
                obj.record_full_frame,
                obj.record_object_bounds,
                obj.record_all_frames,
                obj.frame_record_interval
            );
        }

        return image_recording;
    }

    public static noImageRecording() {
        return new EOIImageRecording(false, false, false, false, 15);
    }
}