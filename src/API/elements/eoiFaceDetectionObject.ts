
export class EOIFaceDetectionObject {
    constructor(
        public person_external_id?: string | null,
        public person_display_name?: string | null,
        public confidence?: number | null,
        public face_quality?: number | null,
        public group_external_id?: string | null,
        public group_display_name?: string | null,
        public image?: string | null) { }


    public static fromJsonObj(obj: any) {
        let result: EOIFaceDetectionObject | undefined = undefined;

        if (obj != null) {
            result = new EOIFaceDetectionObject(
                obj.person_external_id,
                obj.person_display_name,
                obj.confidence,
                obj.face_quality,
                obj.group_external_id,
                obj.group_display_name,
                obj.image);
        }

        return result;
    }

}
