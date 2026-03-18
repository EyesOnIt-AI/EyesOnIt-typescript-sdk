import { EOIImageRecording } from "./eoiImageRecording";
import { EOIVideoRecording } from "./eoiVideoRecording";

export class EOIRecording {
    constructor(
        public enabled: boolean, 
        public record_with_alert: boolean, 
        public record_with_detection: boolean, 
        public record_with_motion: boolean, 
        public record_combined_confidence_threshold: number,
        public save_detection_data: boolean, 
        public save_original_copy: boolean, 
        public recording_folder: string, 
        public output_file_name: string, 
        public include_stream_name: string, 
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
                obj.record_combined_confidence_threshold,
                obj.save_detection_data,
                obj.save_original_copy,
                obj.recording_folder,
                obj.output_file_name,
                obj.include_stream_name,
                EOIVideoRecording.fromJsonObj(obj.video_recording) || EOIVideoRecording.noVideoRecording(),
                EOIImageRecording.fromJsonObj(obj.image_recording) || EOIImageRecording.noImageRecording());
        }

        return recording;
    }
}