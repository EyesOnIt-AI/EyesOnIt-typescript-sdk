import { EOISimilarityImage } from "./eoiSimilarityImage";

/**
 * Similarity-search configuration used by detection/search requests.
 */
export class EOISimilarityConfig {
    /**
     * Reference images used for similarity matching.
     */
    public images: EOISimilarityImage[] = [];

    public static fromJsonObj(obj: any) {
        let similarity_config = undefined;
        
        if (obj != null) {
            similarity_config = new EOISimilarityConfig();

            if (obj.images != null) {
                similarity_config.images = obj.images
                    .map(EOISimilarityImage.fromJsonObj)
                    .filter((image: EOISimilarityImage | undefined): image is EOISimilarityImage => image != null);
            }
        }

        return similarity_config;
    }

    public static default(): EOISimilarityConfig {
        let similarity_config = new EOISimilarityConfig();

        similarity_config.images = [];

        return similarity_config;
    }
}
