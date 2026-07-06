
export class EOISearchResult {
    public confidence: number;
    public source_type: string
    public folder: string;
    public file: string;
    public stream_id: string;
    public stream: string;
    public stream_name: string;
    public region: string;
    public class_name: string;
    public time: string;
    public image: string;
    public facerec_person_id: string;
    public facerec_person_display_name: string;
    public result_id: string;

    constructor() {
    }

    static fromJsonObj(obj: any): EOISearchResult {
        let result = new EOISearchResult();

        result.confidence = obj.confidence;
        result.source_type = obj.source_type;
        result.folder = obj.folder;
        result.file = obj.file;
        result.stream_id = obj.stream_id;
        result.stream = obj.stream_url;
        result.stream_name = obj.stream_name;
        result.region = obj.region;
        result.class_name = obj.class_name;
        result.time = obj.time;
        result.image = obj.image;
        result.facerec_person_id = obj.person_id;
        result.facerec_person_display_name = obj.facerec_person_display_name;
        result.result_id = obj.result_id;

        return result;
    }
}
