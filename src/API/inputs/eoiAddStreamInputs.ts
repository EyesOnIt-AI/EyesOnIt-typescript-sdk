import { EOIAlerting } from "../elements/eoiAlerting";
import { EOIBaseInputs } from "./eoiBaseInputs";
import { EOIResponse } from "../eoiResponse";
import { EOIRegion } from "../elements/eoiRegion";
import { EOIValidation } from "./eoiValidation";
import { EOIRecording } from "../elements/eoiRecording";
import { EOIEffects } from "../elements/eoiEffects";

export class EOIAddStreamInputs extends EOIBaseInputs {
    constructor(
        public stream_url: string, 
        public name: string, 
        public frame_rate: number = 5,
        public regions: EOIRegion[],
        public alerting: EOIAlerting | undefined,
        public recording: EOIRecording | undefined,
        public effects: EOIEffects | undefined) {
        super(regions);
    }

    public static fromJsonObj(obj: any): EOIAddStreamInputs | null {
        let inputs = new EOIAddStreamInputs(obj.stream_url, 
            obj.name,
            obj.frame_rate,
            obj.regions.map(EOIRegion.fromJsonObj),
            EOIAlerting.fromJsonObj(obj.alerting),
            EOIRecording.fromJsonObj(obj.recording),
            EOIEffects.fromJsonObj(obj.effects));

        return EOIValidation.validateAddStreamInputs(inputs).success ? inputs : null;
    }

    public stringify(): string {
        return JSON.stringify(this, this.stringifyFilter);
    }

    private stringifyFilter(key: string, value: any) {
        if (key == "confidence") return undefined;
        else return value;
    }

    public validate(): EOIResponse {
        return EOIValidation.validateAddStreamInputs(this);
    }
}