
export class EOISearchResult {
    public confidence: number;
    public source_type: string
    public folder: string;
    public file: string;
    public stream: string;
    public time: string;
    public image: string;
    public result_id: string;

    constructor() {
    }

    static fromJsonObj(obj: any): EOISearchResult {
        let result = new EOISearchResult();

        result.confidence = obj.confidence;
        result.source_type = obj.source_type;
        result.folder = obj.folder;
        result.file = obj.file;
        result.stream = obj.stream;
        result.time = obj.time;
        result.image = obj.image;
        result.result_id = obj.result_id;

        return result;
    }
}