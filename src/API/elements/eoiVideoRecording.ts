export class EOIVideoRecording {
    constructor(public enabled: boolean, public record_all_frames: boolean) { }

    public static fromJsonObj(obj: any) {
        let video_recording;

        if (obj != null) {
            video_recording = new EOIVideoRecording(
                obj.enabled,
                obj.record_all_frames
            );
        }

        return video_recording;
    }

    public static noVideoRecording() {
        return new EOIVideoRecording(false, false);
    }
}