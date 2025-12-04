export class EOIEffects {
    constructor(
        public show_motion: boolean,
        public show_bounding_boxes: boolean,
        public show_lines: boolean,
        public show_regions: boolean,
        public show_preliminary_detections: boolean,
        public show_validated_detections: boolean,
        public show_confidence_levels: boolean,
        public show_object_count: boolean,
        public show_frame_number: boolean,
        public show_track_id: boolean,
        public show_alert_text: boolean,
        public font_scale: number) { }

    public static fromJsonObj(obj: any) {
        let effects;

        if (obj != null) {
            effects = new EOIEffects(
                obj.show_motion,
                obj.show_bounding_boxes,
                obj.show_lines,
                obj.show_regions,
                obj.show_preliminary_detections,
                obj.show_validated_detections,
                obj.show_confidence_levels,
                obj.show_object_count,
                obj.show_frame_number,
                obj.show_track_id,
                obj.show_alert_text,
                obj.font_scale);
        }

        return effects;
    }
}