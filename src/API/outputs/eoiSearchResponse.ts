import { EOISearchResult } from "../elements/eoiSearchResult";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for archive search operations.
 */
export class EOISearchResponse extends EOIBaseOutputs {
    /**
     * Search results returned by the server.
     */
    public results: EOISearchResult[] = [];

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (eoiResponse.data?.results != null) {
            this.results = eoiResponse.data?.results?.map(EOISearchResult.fromJsonObj);
        }
    }
}
