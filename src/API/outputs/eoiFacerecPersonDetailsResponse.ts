import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

export class EOIFacerecGroup {
    constructor(public external_id: string, public display_name: string) {

    }
}

export class EOIFacerecImage {
    constructor(public path: string, public image: string) {

    }
}

export class EOIFacerecPersonDetailsResponse extends EOIBaseOutputs {
    public person_id: string;
    public person_name: string;
    public groups: EOIFacerecGroup[] = [];
    public images: EOIFacerecImage[] = [];

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