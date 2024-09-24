import { EOIEffects } from "../elements/eoiEffects";
import { EOIRegion } from "../elements/eoiRegion";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseInputs } from "./eoiBaseInputs";
import { EOIValidation } from "./eoiValidation";

export class EOIProcessVideoInputs extends EOIBaseInputs {
    constructor(
        public input_video_path_list: string[], 
        public output_video_path: string, 
        public frame_rate: number = 5,
        public regions: EOIRegion[],
        public synchronous: boolean = true,
        public real_time: boolean = false,
        public output_all_frames: boolean = true,
        public effects: EOIEffects | undefined,
        public start_seconds: number,
        public end_seconds: number) {
        super(regions);
    }

    public static fromJsonObj(obj: any): EOIProcessVideoInputs | null {
        let inputs = new EOIProcessVideoInputs(obj.input_video_path_list, 
            obj.output_video_path,
            obj.frame_rate,
            obj.regions.map(EOIRegion.fromJsonObj),
            obj.synchronous,
            obj.real_time,
            obj.output_all_frames,
            EOIEffects.fromJsonObj(obj.effects),
            obj.start_seconds,
            obj.end_seconds);

        return EOIValidation.validateProcessVideoInputs(inputs).success ? inputs : null;
    }

    public stringify(): string {
        return JSON.stringify(this, this.stringifyFilter);
    }

    private stringifyFilter(key: string, value: any) {
        if (key == "confidence") return undefined;
        else return value;
    }

    public validate(): EOIResponse {
        return EOIValidation.validateProcessVideoInputs(this);
    }
}