import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Response wrapper for `isLicenseValid`.
 */
export class EOILicenseValidityResponse extends EOIBaseOutputs {
    /**
     * Indicates whether a license key has been entered.
     */
    public entered?: boolean;

    /**
     * Indicates whether the current license is valid.
     */
    public valid?: boolean;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        this.entered = eoiResponse.data?.entered;
        this.valid = eoiResponse.data?.valid;
    }
}
