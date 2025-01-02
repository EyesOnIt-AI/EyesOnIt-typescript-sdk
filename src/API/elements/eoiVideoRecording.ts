export class EOIVideoRecording {
    constructor(public enabled: boolean) { }

    public static fromJsonObj(obj: any) {
        let video_recording;

        if (obj != null) {
            video_recording = new EOIVideoRecording(
                obj.enabled);
        }

        return video_recording;
    }

    public static noVideoRecording() {
        return new EOIVideoRecording(false);
    }
}