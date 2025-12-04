import { EOISearchResult } from "../elements/eoiSearchResult";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOILiveSearchResponse extends EOIBaseOutputs {
    public search_id: number = 0;

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (eoiResponse.data != null) {
            this.search_id = eoiResponse.data.search_id;
        }
    }
}