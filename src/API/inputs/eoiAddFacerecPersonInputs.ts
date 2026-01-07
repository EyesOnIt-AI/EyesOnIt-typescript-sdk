import { DateTime } from "luxon";
import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOIAddFacerecPersonImage {
    constructor(public image: string, public file_path: string, public capture_time: string) {

    }
}


export class EOIAddFacerecPersonInputs {
    public person_images: EOIAddFacerecPersonImage[] = []

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

    public addImageBase64(image: string, file_path: string) {
        this.person_images.push(new EOIAddFacerecPersonImage(image, file_path, DateTime.now().toISO()))
    }

    public validate(): EOIResponse {
        return EOIValidator.validateNewFacerecPerson(this);
    }
}