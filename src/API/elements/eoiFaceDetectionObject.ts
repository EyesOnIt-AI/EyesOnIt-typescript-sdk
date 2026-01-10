
export class EOIFaceDetectionObject {
    constructor(
        public person_external_id: string,
        public person_display_name: string,
        public confidence: number,
        public face_quality: number,
        public group_external_id?: string,
        public group_display_name?: string) { }


    public static fromJsonObj(obj: any) {
        let result: EOIFaceDetectionObject | undefined = undefined;

        if (obj != null) {
            result = new EOIFaceDetectionObject(
                obj.person_external_id,
                obj.person_display_name,
                obj.confidence,
                obj.face_quality,
                obj.group_external_id,
                obj.group_display_name);
        }

        return result;
    }

}