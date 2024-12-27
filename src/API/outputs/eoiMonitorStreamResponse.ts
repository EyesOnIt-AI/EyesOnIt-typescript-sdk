import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIMonitorStreamResponse extends EOIBaseOutputs {
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
    }
}