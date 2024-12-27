export class EOIEffects {
    constructor(
        public show_motion: boolean,
        public show_bounding_boxes: boolean,
        public show_lines: boolean,
        public show_regions: boolean,
        public show_confidence_levels: boolean) { }

    public static fromJsonObj(obj: any) {
        let effects;

        if (obj != null) {
            effects = new EOIEffects(
                obj.show_motion,
                obj.show_bounding_boxes,
                obj.show_lines,
                obj.show_regions,
                obj.show_confidence_levels);
        }

        return effects;
    }
}