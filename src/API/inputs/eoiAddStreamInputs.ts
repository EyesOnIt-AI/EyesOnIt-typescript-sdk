import { EOINotification } from "../elements/eoiNotification";
import { EOIBaseInputs } from "./eoiBaseInputs";
import { EOIResponse } from "../eoiResponse";
import { EOIRegion } from "../elements/eoiRegion";
import { EOIValidator } from "../eoiValidator";
import { EOIRecording } from "../elements/eoiRecording";
import { EOIEffects } from "../elements/eoiEffects";
import { EOILine } from "../elements/eoiLine";
import { EOICameraCalibration } from "../elements/eoiCameraCalibration";
import { EOI_CURRENT_SCHEMA_VERSION, EOISchemaVersion } from "../eoiSchemaVersion";

/**
 * Request payload for registering a stream and its monitoring configuration.
 */
export class EOIAddStreamInputs extends EOIBaseInputs {
    public schema_version: EOISchemaVersion = EOI_CURRENT_SCHEMA_VERSION;
    public stream_id: string | undefined;

    /**
     * @param stream_url RTSP URL for the stream.
     * @param name Stream display name. Minimum length: 3.
     * @param frame_width Frame width. Can be null if not available.
     * @param frame_height Frame height. Can be null if not available.
     * @param frame_rate Processing frame rate. Default: `5`. Minimum: `1`.
     * @param index_for_search Whether this stream should be indexed for archive search.
     * @param search_index_types Search index types to build when indexing is enabled.
     * @param regions Detection regions and configuration.
     * @param lines Optional named lines used by line-cross conditions.
     * @param notification Optional notification settings (for example phone alerting).
     * @param recording Optional recording settings.
     * @param effects Optional visual effect overlays for output frames.
     * @param calibration Optional camera-level floor-plane calibration.
     */
    constructor(
        public stream_url: string, 
        public name: string, 
        public frame_width: number,
        public frame_height: number,
        public frame_rate: number = 5,
        public index_for_search: boolean,
        public search_index_types: string[] = [],
        public regions: EOIRegion[],
        public lines: EOILine[] | undefined,
        public notification: EOINotification | undefined,
        public recording: EOIRecording | undefined,
        public effects: EOIEffects | undefined,
        public calibration?: EOICameraCalibration | undefined) {
        super(regions);
    }

    public static fromJsonObj(obj: any): EOIAddStreamInputs | null {
        let inputs = new EOIAddStreamInputs(obj.stream_url, 
            obj.name,
            obj.frame_width,
            obj.frame_height,
            obj.frame_rate,
            obj.index_for_search,
            obj.search_index_types,
            obj.regions?.map(EOIRegion.fromJsonObj),
            obj.lines?.map(EOILine.fromJsonObj),
            EOINotification.fromJsonObj(obj.notification),
            EOIRecording.fromJsonObj(obj.recording),
            EOIEffects.fromJsonObj(obj.effects),
            EOICameraCalibration.fromJsonObj(obj.calibration));
        inputs.schema_version = obj.schema_version ?? EOI_CURRENT_SCHEMA_VERSION;
        inputs.stream_id = obj.stream_id;

        return EOIValidator.validateAddStreamInputs(inputs).success ? inputs : null;
    }

    public toRequestBody(): any {
        return JSON.parse(this.stringify());
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
        else if (key == "conditions") return undefined;
        else if (key == "interaction_rules") return undefined;
        else return value;
    }

    /**
     * Validates this payload against SDK-side constraints.
     */
    public validate(): EOIResponse {
        return EOIValidator.validateAddStreamInputs(this);
    }
}
