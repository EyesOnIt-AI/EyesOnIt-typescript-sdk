import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Face recognition group associated with a person profile.
 */
export class EOIFacerecGroup {
    public remote_managed?: boolean;
    public managed_by?: string;

    /**
     * @param external_id Stable group identifier.
     * @param display_name Human-readable group name.
     */
    constructor(public external_id: string, public display_name: string, remote_managed?: boolean, managed_by?: string) {
        this.remote_managed = remote_managed;
        this.managed_by = managed_by;

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
     * True when this person is managed by remote management.
     */
    public remote_managed: boolean = false;
    /**
     * Owner identifier for remotely managed records.
     */
    public managed_by?: string;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data) {
                this.person_id = eoiResponse.data.person_id;
                this.person_name = eoiResponse.data.person_name;
                this.remote_managed = eoiResponse.data.remote_managed === true;
                this.managed_by = eoiResponse.data.managed_by;

                if (eoiResponse.data.groups != null) {
                    for (const group of eoiResponse.data.groups) {
                        this.groups.push(new EOIFacerecGroup(
                            group.external_id,
                            group.display_name,
                            group.remote_managed === true,
                            group.managed_by
                        ));
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
