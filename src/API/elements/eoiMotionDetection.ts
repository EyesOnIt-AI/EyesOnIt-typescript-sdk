export class EOIMotionDetection {

    constructor(
        public enabled: boolean,
        public detection_threshold: number,
        public regular_check_frame_interval: number,
        public backup_check_frame_interval?: number) { }

    public static fromJsonObj(obj: any): EOIMotionDetection | undefined {
        let motionDetection = undefined;

        if (obj != undefined) {
            motionDetection = new EOIMotionDetection(
                obj.enabled,
                obj.detection_threshold,
                obj.regular_check_frame_interval,
                obj.backup_check_frame_interval);
        }

        return motionDetection;
    }

    public static default(): EOIMotionDetection {
        return new EOIMotionDetection(true, 300, 5);
    }
}