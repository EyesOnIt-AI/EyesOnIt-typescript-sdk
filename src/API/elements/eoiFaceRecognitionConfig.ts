/**
 * Face recognition matching options used by detection and search configuration.
 */
export class EOIFaceRecognitionConfig {
    /**
     * Match strategy. Typical values are server-defined (for example person/group matching mode).
     */
    public match_type: string;
    /**
     * Match confidence threshold.
     * Common range is 0-100; defaults to `80`.
     */
    public match_threshold: number = 80;
    /**
     * Optional person identifier for person-specific matching.
     */
    public person?: string;
    /**
     * Optional group identifier for group-level matching.
     */
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

        return face_recognition_config;
    }

    public static default(): EOIFaceRecognitionConfig {
        let face_recognition_config = new EOIFaceRecognitionConfig();

        face_recognition_config.match_type = "";
        face_recognition_config.match_threshold = 80;
        face_recognition_config.person = "";
        face_recognition_config.group = "";

        return face_recognition_config;
    }
}
