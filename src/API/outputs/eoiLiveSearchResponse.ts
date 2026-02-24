import { EOISearchResult } from "../elements/eoiSearchResult";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


/**
 * Response wrapper for `searchLive`.
 */
export class EOILiveSearchResponse extends EOIBaseOutputs {
    /**
     * Identifier of the created live search task.
     */
    public search_id: number = 0;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (eoiResponse.data != null) {
            this.search_id = eoiResponse.data.search_id;
        }
    }
}
