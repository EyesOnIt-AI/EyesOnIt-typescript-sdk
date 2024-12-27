import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIRemoveStreamResponse extends EOIBaseOutputs {
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
    }
}