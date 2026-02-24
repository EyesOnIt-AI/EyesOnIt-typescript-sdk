import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Face recognition group associated with a person profile.
 */
export class EOIFacerecGroup {
    /**
     * @param external_id Stable group identifier.
     * @param display_name Human-readable group name.
     */
    constructor(public external_id: string, public display_name: string) {

    }
}

/**
 * Face image associated with a person profile.
 */
export class EOIFacerecImage {
    /**
     * @param path Source path for the image record.
     * @param image Optional base64 image payload.
     */
    constructor(public path: string, public image: string) {

    }
}

/**
 * Response wrapper for `getFacerecPersonDetails`.
 */
export class EOIFacerecPersonDetailsResponse extends EOIBaseOutputs {
    /**
     * Person identifier.
     */
    public person_id: string;
    /**
     * Person display name.
     */
    public person_name: string;
    /**
     * Groups associated with this person.
     */
    public groups: EOIFacerecGroup[] = [];
    /**
     * Images associated with this person.
     */
    public images: EOIFacerecImage[] = [];

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data) {
                this.person_id = eoiResponse.data.person_id;
                this.person_name = eoiResponse.data.person_name;

                if (eoiResponse.data.groups != null) {
                    for (const group of eoiResponse.data.groups) {
                        this.groups.push(new EOIFacerecGroup(group.external_id, group.display_name));
                    }
                }

                if (eoiResponse.data.images != null) {
                    for (const image of eoiResponse.data.images) {
                        this.images.push(new EOIFacerecImage(image.path, image.image));
                    }
                }
            }
        }
    }
}
