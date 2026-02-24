import { DateTime } from "luxon";
import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

/**
 * Request payload for bulk importing face recognition people from a file.
 */
export class EOIAddFacerecPeopleInputs {
    /**
     * @param file_path File path to the import file. Must be a valid path string.
     */
    constructor(public file_path: string) {
    }

    public static fromJsonObj(obj: any): EOIAddFacerecPeopleInputs | null {
        let inputs = new EOIAddFacerecPeopleInputs(obj.file_path);

        return inputs;
    }
    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateAddFacerecPeople(this);
    }
}
