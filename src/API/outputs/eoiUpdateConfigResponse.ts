import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIUpdateConfigResponse extends EOIBaseOutputs {
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
    }
}