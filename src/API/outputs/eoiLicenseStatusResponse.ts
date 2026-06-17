import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Response wrapper for license status endpoints.
 */
export class EOILicenseStatusResponse extends EOIBaseOutputs {
    /**
     * Raw license status payload returned by the server.
     */
    public data: any;

    /**
     * License key reported by the server.
     */
    public license_key?: string;

    /**
     * Indicates whether the current license is valid.
     */
    public valid?: boolean;

    /**
     * License type reported by the server.
     */
    public license_type?: string;

    /**
     * Permission map reported by the server.
     */
    public permissions: any;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        this.data = eoiResponse.data;
        this.license_key = eoiResponse.data?.license_key;
        this.valid = eoiResponse.data?.valid;
        this.license_type = eoiResponse.data?.license_type;
        this.permissions = eoiResponse.data?.permissions;
    }
}
