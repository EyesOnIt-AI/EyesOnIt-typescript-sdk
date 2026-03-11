import * as fs from 'fs';

/**
 * One reference image used for similarity matching.
 */
export class EOISimilarityImage {
    /**
     * Base64-encoded reference image used for similarity matching.
     */
    public image?: string;
    /**
     * Whether this image should trigger alerts when its threshold is met.
     */
    public alert: boolean = true;
    /**
     * Alerting threshold for this image.
     * Required when `alert` is `true`.
     */
    public threshold?: number;

    public static fromJsonObj(obj: any) {
        let similarity_image = undefined;

        if (obj != null) {
            similarity_image = new EOISimilarityImage();

            let imageBase64 = obj.image;

            if (obj.image_path) {
                let fileContent = fs.readFileSync(obj.image_path);
                imageBase64 = fileContent.toString('base64');
            }

            similarity_image.image = imageBase64;
            similarity_image.alert = obj.alert == null ? true : obj.alert == true;
            similarity_image.threshold = obj.threshold;
        }

        return similarity_image;
    }

    public static default(): EOISimilarityImage {
        let similarity_image = new EOISimilarityImage();

        similarity_image.image = undefined;
        similarity_image.alert = true;
        similarity_image.threshold = 80;

        return similarity_image;
    }
}
