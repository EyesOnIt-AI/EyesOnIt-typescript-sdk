import { EOIEffects } from "../elements/eoiEffects";
import { EOILine } from "../elements/eoiLine";
import { EOIRecording } from "../elements/eoiRecording";
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
        public lines: EOILine[] | undefined,
        public synchronous: boolean = true,
        public real_time: boolean = false,
        public output_all_frames: boolean = true,
        public effects: EOIEffects | undefined,
        public recording: EOIRecording | undefined,
        public start_seconds: number,
        public end_seconds: number) {
        super(regions);
    }

    public static fromJsonObj(obj: any): EOIProcessVideoInputs | null {
        let inputs = new EOIProcessVideoInputs(obj.input_video_path_list, 
            obj.output_video_path,
            obj.frame_rate,
            obj.regions?.map(EOIRegion.fromJsonObj),
            obj.lines?.map(EOILine.fromJsonObj),
            obj.synchronous,
            obj.real_time,
            obj.output_all_frames,
            EOIEffects.fromJsonObj(obj.effects),
            EOIRecording.fromJsonObj(obj.recording),
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