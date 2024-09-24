import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";


export class EOIStopMonitoringStreamResponse extends EOIBaseOutputs {
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
    }
}