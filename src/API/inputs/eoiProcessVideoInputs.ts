import { EOIEffects } from "../elements/eoiEffects";
import { EOILine } from "../elements/eoiLine";
import { EOIRecording } from "../elements/eoiRecording";
import { EOIRegion } from "../elements/eoiRegion";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseInputs } from "./eoiBaseInputs";
import { EOIValidator } from "../eoiValidator";
import { EOIValidation } from "../elements/eoiValidation";

/**
 * Request payload for processing one or more video files.
 */
export class EOIProcessVideoInputs extends EOIBaseInputs {
    /**
     * @param name Job/display name for the video process request. Minimum length: 3.
     * @param input_video_path_list Input video file paths to process.
     * @param output_video_path Output path for generated/annotated video.
     * @param frame_rate Processing frame rate. Default: `5`. Minimum: `1`.
     * @param index_for_search Whether to index results for archive search.
     * @param search_index_types Search index types to build when indexing is enabled.
     * @param regions Detection regions and configuration.
     * @param lines Optional named lines used by line-cross conditions.
     * @param real_time Enables real-time style pacing while processing.
     * @param video_start_interval Offset interval for scheduling/segment logic.
     * @param output_all_frames Whether all frames should be written to output.
     * @param effects Optional visual effects/overlays configuration.
     * @param recording Optional recording configuration.
     * @param video_start_local_time Start time in ISO date-time format.
     * @param start_seconds Optional trim start offset in seconds.
     * @param end_seconds Optional trim end offset in seconds.
     * @param mode Processing mode. Default: `KNOWN_OBJECT_DETECTION`.
     * @param base_image_path Optional base image path used by selected modes/plugins.
     * @param plugins Optional plugin configuration object.
     * @param validation Optional output validation configuration.
     */
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
        public video_start_interval: number = 0,
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
            obj.video_start_interval,
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

    /**
     * Serializes this payload for the API request body.
     * The serializer excludes nested `confidence` values.
     */
    public stringify(): string {
        return JSON.stringify(this, this.stringifyFilter);
    }

    private stringifyFilter(key: string, value: any) {
        if (key == "confidence") return undefined;
        else return value;
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateProcessVideoInputs(this);
    }
}
