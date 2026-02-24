import { EOIResponse } from "../eoiResponse";
import { EOIValidator } from "../eoiValidator";

/**
 * Request payload for creating a face recognition group.
 */
export class EOIAddFacerecGroupInputs {
    /**
     * @param group_id Stable group identifier used in API operations. Minimum length: 2.
     * @param group_name Display name shown to users. Minimum length: 2.
     * @param group_description Human-readable description of the group. Minimum length: 10.
     */
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

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateNewFacerecGroup(this);
    }
}
