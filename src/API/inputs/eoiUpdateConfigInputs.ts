import { EOIResponse } from "../eoiResponse";

/**
 * Request payload for `/update_config`.
 */
export class EOIUpdateConfigInputs {
    /**
     * @param body Arbitrary configuration payload accepted by the server.
     */
    constructor(public body: any) {
    }

    /**
     * Returns a success response because this payload has no SDK-side schema validation.
     */
    public validate(): EOIResponse {
        return EOIResponse.success();
    }
}
