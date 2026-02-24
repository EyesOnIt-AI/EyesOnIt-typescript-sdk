
export class EOISearchInputs {
    public class_name: string;
    public search_type: string | null = null;            // class_name, natural_language, face_recognition, similarity
    public object_description: string;
    public seed_id: string | undefined;
    public image: string | undefined;
    public face_person_id: string;
    public face_group_id: string;
    public alert_threshold: number;
    public stream_list: string[] | undefined;

    constructor() {

    }

    public setBaseProperties(obj: any) {
        this.class_name = obj.class_name;
        this.search_type = obj.search_type;
        this.object_description = obj.object_description;
        this.seed_id = obj.seed_id;
        this.image = obj.image;
        this.face_person_id = obj.face_person_id;
        this.face_group_id = obj.face_group_id;
        this.alert_threshold = obj.threshold;
        this.stream_list = obj.stream_list;
    }
}