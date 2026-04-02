/**
 * One reference image used for similarity matching.
 */
export class EOISimilarityImage {
    /**
     * Result ID of reference image used for similarity matching.
     */
    public seed_id?: string;
    /**
     * Base64-encoded reference image used for similarity matching.
     */
    public image?: string;
    /**
     * Whether this image should trigger alerts when its threshold is met.
     */
    public alert: boolean | undefined = undefined;
    /**
     * Alerting threshold for this image.
     * Required when `alert` is `true`.
     */
    public threshold?: number;

    private static readImagePathAsBase64(imagePath: string): string {
        const getRequire = Function("try { return require; } catch { return undefined; }");
        const nodeRequire = getRequire() as NodeRequire | undefined;

        if (typeof nodeRequire !== "function") {
            throw new Error("image_path is only supported in Node.js environments. Provide image as base64 when running in the browser.");
        }

        const fs = nodeRequire("fs") as typeof import("fs");
        const fileContent = fs.readFileSync(imagePath);

        return fileContent.toString("base64");
    }

    public static fromJsonObj(obj: any) {
        let similarity_image = undefined;

        if (obj != null) {
            similarity_image = new EOISimilarityImage();

            let imageBase64 = obj.image;

            if (obj.image_path) {
                imageBase64 = this.readImagePathAsBase64(obj.image_path);
            }

            similarity_image.seed_id = obj.seed_id;
            similarity_image.image = imageBase64;
            similarity_image.alert = typeof obj.alert === "boolean" ? obj.alert : undefined;
            similarity_image.threshold = obj.threshold;
        }

        return similarity_image;
    }

    public static default(): EOISimilarityImage {
        let similarity_image = new EOISimilarityImage();

        similarity_image.seed_id = undefined;
        similarity_image.image = undefined;
        similarity_image.alert = true;
        similarity_image.threshold = 80;

        return similarity_image;
    }
}
