import { EOIResponse } from "../eoiResponse";

/**
 * Request payload for validating and applying a license.
 */
export class EOIValidateLicenseInputs {
    /**
     * @param key License key.
     * @param token License validation token.
     */
    constructor(public key: string, public token: string) {
    }

    /**
     * Validates this payload against SDK-side constraints without exposing secret values.
     */
    public validate(): EOIResponse {
        if (this.key == null || this.key.trim().length === 0) {
            return new EOIResponse(false, "key must be provided");
        }

        if (this.token == null || this.token.trim().length === 0) {
            return new EOIResponse(false, "token must be provided");
        }

        return EOIResponse.success();
    }
}
