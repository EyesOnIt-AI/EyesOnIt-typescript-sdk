import { EOIImageRecording } from "./eoiImageRecording";
import { EOIVideoRecording } from "./eoiVideoRecording";

export class EOIRecording {
    constructor(
        public enabled: boolean, 
        public record_with_alert: boolean, 
        public record_with_detection: boolean, 
        public record_with_motion: boolean, 
        public save_original_copy: boolean, 
        public recording_folder: string, 
        public video_recording: EOIVideoRecording, 
        public image_recording: EOIImageRecording) { }

    public static fromJsonObj(obj: any) {
        let recording;

        if (obj != null) {
            recording = new EOIRecording(
                obj.enabled,
                obj.record_with_alert,
                obj.record_with_detection,
                obj.record_with_motion,
                obj.save_original_copy,
                obj.recording_folder,
                EOIVideoRecording.fromJsonObj(obj.video_recording) || EOIVideoRecording.noVideoRecording(),
                EOIImageRecording.fromJsonObj(obj.image_recording) || EOIImageRecording.noImageRecording());
        }

        return recording;
    }
}