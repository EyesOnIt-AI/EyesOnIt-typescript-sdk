import { EOIResponse } from "../eoiResponse";


export class EOIBaseOutputs {
    public success: boolean;
    public message?: string;

    constructor(eoiResponse: EOIResponse) {
        this.success = eoiResponse.success;
        this.message = eoiResponse.message;
    }
}