import { DateTime } from "luxon";
import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

/**
 * One image entry used when creating or updating a face recognition person.
 */
export class EOIAddFacerecPersonImage {
    /**
     * @param image Base64-encoded image. Provide this or `file_path`.
     * @param file_path Local file path. Provide this or `image`.
     * @param capture_time ISO date-time string for when the image was captured.
     */
    constructor(public image: string, public file_path: string, public capture_time: string) {

    }
}

/**
 * Request payload for creating a face recognition person profile.
 */
export class EOIAddFacerecPersonInputs {
    /**
     * Images associated with the person profile.
     * At least one valid image or file path is required.
     */
    public person_images: EOIAddFacerecPersonImage[] = []

    /**
     * @param person_id Stable person identifier used in API operations. Minimum length: 2.
     * @param person_display_name Display name shown to users. Minimum length: 2.
     * @param person_groups Face recognition group IDs to associate with this person.
     */
    constructor(
        public person_id: string, 
        public person_display_name: string, 
        public person_groups: string[]) {
    }

    public static fromJsonObj(obj: any): EOIAddFacerecPersonInputs | null {
        let inputs = new EOIAddFacerecPersonInputs(
            obj.person_id,
            obj.person_display_name,
            obj.person_groups
        );

        return inputs;
    }

    /**
     * Adds a base64 image entry and sets `capture_time` to the current timestamp.
     *
     * @param image Base64-encoded image data.
     * @param file_path Optional file path associated with this image.
     * @example
     * `inputs.addImageBase64(base64Jpeg, "C:\\images\\person.jpg")`
     */
    public addImageBase64(image: string, file_path: string) {
        this.person_images.push(new EOIAddFacerecPersonImage(image, file_path, DateTime.now().toISO()))
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateNewFacerecPerson(this);
    }
}
