/**
 * Similarity-search configuration used by detection/search requests.
 */
export class EOISimilarityConfig {
    /**
     * Base64-encoded reference image used for similarity matching.
     */
    public image: string | undefined;
    
    /**
     * Match confidence threshold.
     * Common range is 0-100; defaults to `80`.
     */
    public match_threshold: number = 80;

    public static fromJsonObj(obj: any) {
        let similarity_config = undefined;
        
        if (obj != null) {
            similarity_config = new EOISimilarityConfig();
            similarity_config.image = obj.image;
            similarity_config.match_threshold = obj.match_threshold;
        }

        return similarity_config;
    }

    public static default(): EOISimilarityConfig {
        let similarity_config = new EOISimilarityConfig();

        similarity_config.image = undefined;
        similarity_config.match_threshold = 80;

        return similarity_config;
    }
}
