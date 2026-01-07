export class EOIFaceRecognitionConfig {
    public match_type: string;
    public match_threshold: number;
    public person?: string;
    public group?: string | null = null;

    public static fromJsonObj(obj: any) {
        let face_recognition_config = undefined;
        
        if (obj != null) {
            face_recognition_config = new EOIFaceRecognitionConfig();
            face_recognition_config.match_type = obj.match_type;
            face_recognition_config.match_threshold = obj.match_threshold;
            face_recognition_config.person = obj.person;
            face_recognition_config.group = obj.group;
        }
        else {
            face_recognition_config = EOIFaceRecognitionConfig.default();
        }

        return face_recognition_config;
    }

    public static default(): EOIFaceRecognitionConfig {
        let face_recognition_config = new EOIFaceRecognitionConfig();

        face_recognition_config.match_type = "";
        face_recognition_config.match_threshold = 100;
        face_recognition_config.person = "";
        face_recognition_config.group = "";

        return face_recognition_config;
    }
}