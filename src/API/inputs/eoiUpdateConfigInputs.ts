import { EOIResponse } from "../eoiResponse";

export class EOIUpdateConfigInputs {
    constructor(public body: any) {
    }

    public validate(): EOIResponse {
        return EOIResponse.success();
    }
}