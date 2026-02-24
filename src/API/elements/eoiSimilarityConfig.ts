export class EOISimilarityConfig {
    public image: string | undefined;

    public static fromJsonObj(obj: any) {
        let similarity_config = undefined;
        
        if (obj != null) {
            similarity_config = new EOISimilarityConfig();
            similarity_config.image = obj.image;
        }

        return similarity_config;
    }

    public static default(): EOISimilarityConfig {
        let similarity_config = new EOISimilarityConfig();

        similarity_config.image = undefined;

        return similarity_config;
    }
}