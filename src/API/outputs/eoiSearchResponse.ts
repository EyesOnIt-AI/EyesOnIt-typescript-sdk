import { EOISearchResult } from "../elements/eoiSearchResult";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOISearchResponse extends EOIBaseOutputs {
    public results: EOISearchResult[] = [];

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);

        if (eoiResponse.data?.results != null) {
            this.results = eoiResponse.data?.results?.map(EOISearchResult.fromJsonObj);
        }
    }
}