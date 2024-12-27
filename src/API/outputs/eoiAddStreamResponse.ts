import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIAddStreamResponse extends EOIBaseOutputs {
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
    }
}