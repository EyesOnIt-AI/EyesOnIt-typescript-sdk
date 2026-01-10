import { DateTime } from "luxon";
import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOIAddFacerecPeopleInputs {
    constructor(public file_path: string) {
    }

    public static fromJsonObj(obj: any): EOIAddFacerecPeopleInputs | null {
        let inputs = new EOIAddFacerecPeopleInputs(obj.file_path);

        return inputs;
    }
    public validate(): EOIResponse {
        return EOIValidator.validateAddFacerecPeople(this);
    }
}