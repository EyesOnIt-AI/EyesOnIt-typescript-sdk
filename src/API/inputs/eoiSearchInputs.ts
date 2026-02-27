
/**
 * Base search criteria shared by live and archive search requests.
 */
export class EOISearchInputs {
    /**
     * Object class to search for.
     * Valid values include: `person`, `face`, `vehicle`, `bag`, `animal`, `unknown`.
     */
    public class_name: string;
    /**
     * Search strategy.
     * Supported values: `class_name`, `natural_language`, `face_recognition`, `similarity`.
     */
    public search_type: string | null = null;            // class_name, natural_language, face_recognition, similarity
    /**
     * Natural-language query used for object/event matching.
     */
    public object_description: string;
    /**
     * Seed image identifier used for similarity search.
     */
    public seed_id: string | undefined;
    /**
     * Base64-encoded image used for similarity search.
     */
    public image: string | undefined;
    /**
     * Face recognition match type: `person` or `group`
     */
    public face_match_type: string;            // person, group
    /**
     * Face recognition person ID for targeted face search.
     */
    public face_person_id: string;
    /**
     * Face recognition group ID for targeted face search.
     */
    public face_group_id: string;
    /**
     * Alert threshold for search confidence.
     * Expected range: greater than `0` and less than `100` for live search.
     */
    public alert_threshold: number;
    /**
     * Optional list of stream URLs to constrain search scope.
     */
    public stream_list: string[] | undefined;

    constructor() {

    }

    /**
     * Copies shared search properties from a plain object.
     * Used by `fromJsonObj` helper methods in derived classes.
     */
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
