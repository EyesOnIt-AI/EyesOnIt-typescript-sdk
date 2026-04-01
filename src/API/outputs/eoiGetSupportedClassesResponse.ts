import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Response wrapper for `getSupportedClasses`.
 */
export class EOIGetSupportedClassesResponse extends EOIBaseOutputs {
    /**
     * Supported class names returned by the server.
     */
    public classes: string[] = [];

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success && eoiResponse.data?.supported_classes != null) {
            this.classes = eoiResponse.data.supported_classes;
        }
    }
}
