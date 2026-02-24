import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Face recognition name search match.
 */
export class EOISearchFacerecNamesResult {
    /**
     * External identifier for the matched entity.
     */
    public external_id: string;
    /**
     * Display name for the matched entity.
     */
    public display_name: string;
}

/**
 * Response wrapper for `searchFacerecGroupNames` and `searchFacerecPeopleNames`.
 */
export class EOISearchFacerecNamesResponse extends EOIBaseOutputs {
    /**
     * Matching names returned by the search.
     */
    public matches: EOISearchFacerecNamesResult[];

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (this.success) {
            if (eoiResponse.data?.matches != null) {
                this.matches = eoiResponse.data.matches;
            }
        }
    }
}
