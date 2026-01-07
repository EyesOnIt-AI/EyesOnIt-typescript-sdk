import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

export class EOIAddFacerecGroupInputs {
    constructor(public group_id: string, public group_name: string, public group_description: string) {
        
    }

    public static fromJsonObj(obj: any): EOIAddFacerecGroupInputs | null {
        let inputs = new EOIAddFacerecGroupInputs(
            obj.group_id,
            obj.group_name,
            obj.group_description
        );

        return EOIValidator.validateNewFacerecGroup(inputs).success ? inputs : null;
    }

    public validate(): EOIResponse {
        return EOIValidator.validateNewFacerecGroup(this);
    }
}