import { EOIEffects } from "../elements/eoiEffects";
import { EOILine } from "../elements/eoiLine";
import { EOIRecording } from "../elements/eoiRecording";
import { EOIRegion } from "../elements/eoiRegion";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseInputs } from "./eoiBaseInputs";
import { EOIValidator } from "../eoiValidator";
import { EOIValidation } from "../elements/eoiValidation";

export class EOIProcessVideoInputs extends EOIBaseInputs {
    constructor(
        public name: string,
        public input_video_path_list: string[], 
        public output_video_path: string, 
        public frame_rate: number = 5,
        public index_for_search: boolean,
        public search_index_types: string[] = [],
        public regions: EOIRegion[],
        public lines: EOILine[] | undefined,
        public real_time: boolean = false,
        public output_all_frames: boolean = true,
        public effects: EOIEffects | undefined,
        public recording: EOIRecording | undefined,
        public video_start_local_time: string,
        public start_seconds: number,
        public end_seconds: number,
        public mode: string = "KNOWN_OBJECT_DETECTION",
        public base_image_path: string | undefined = undefined,
        public plugins: object,
        public validation: EOIValidation) {
        super(regions);
    }

    public static fromJsonObj(obj: any): EOIProcessVideoInputs {
        let inputs = new EOIProcessVideoInputs(obj.name, 
            obj.input_video_path_list, 
            obj.output_video_path,
            obj.frame_rate,
            obj.index_for_search,
            obj.search_index_types,
            obj.regions?.map(EOIRegion.fromJsonObj),
            obj.lines?.map(EOILine.fromJsonObj),
            obj.real_time,
            obj.output_all_frames,
            EOIEffects.fromJsonObj(obj.effects),
            EOIRecording.fromJsonObj(obj.recording),
            obj.video_start_local_time,
            obj.start_seconds,
            obj.end_seconds,
            obj.mode,
            obj.base_image_path,
            obj.plugins,
            obj.validation);

        let response = EOIValidator.validateProcessVideoInputs(inputs)

        if (!response.success) {
            throw new Error(response.message);
        }

        return inputs;
    }

    public stringify(): string {
        return JSON.stringify(this, this.stringifyFilter);
    }

    private stringifyFilter(key: string, value: any) {
        if (key == "confidence") return undefined;
        else return value;
    }

    public validate(): EOIResponse {
        return EOIValidator.validateProcessVideoInputs(this);
    }
}