import { EOILine } from "./eoiLine";
import { EOINotification } from "./eoiNotification";
import { EOIRecording } from "./eoiRecording";
import { EOIRegion } from "./eoiRegion";
import { EOICameraCalibration } from "./eoiCameraCalibration";

export interface EOIConfigurationWarning {
    code: string;
    message: string;
    configured_width?: number;
    configured_height?: number;
    observed_width?: number;
    observed_height?: number;
}

export class EOIStreamInfo {
    public schema_version?: string;
    public stream_url: string;
    public stream_id: string;
    public name: string;
    public frame_rate: number;
    public index_for_search: boolean;
    public search_index_types: string[];
    public status: string;
    public regions: EOIRegion[];
    public lines: EOILine[];
    public calibration: EOICameraCalibration | undefined;
    public notification: EOINotification | undefined;
    public recording: EOIRecording | undefined;
    public configuration_warnings: EOIConfigurationWarning[] = [];

    public static fromJsonObj(obj: any): EOIStreamInfo {
        let streamInfo: EOIStreamInfo = new EOIStreamInfo();
        streamInfo.initFromJson(obj);

        return streamInfo;
    }

    public initFromJson(obj: any) {
        this.schema_version = obj.schema_version;
        this.stream_url = obj.stream_url;
        this.stream_id = obj.stream_id;
        this.name = obj.name;
        this.status = obj.status;
        this.frame_rate = obj.frame_rate;
        this.index_for_search = obj.index_for_search;
        this.search_index_types = obj.search_index_types;

        this.regions = obj.regions != null ? obj.regions.map(EOIRegion.fromJsonObj) : [];
        this.lines = obj.lines != null ? obj.lines.map(EOILine.fromJsonObj) : [];
        this.calibration = EOICameraCalibration.fromJsonObj(obj.calibration);
        this.notification = EOINotification.fromJsonObj(obj.notification);
        this.recording = EOIRecording.fromJsonObj(obj.recording);
        this.configuration_warnings = Array.isArray(obj.configuration_warnings) ? obj.configuration_warnings : [];
    }

    public isMonitoring(): boolean {
        return this.status == "MONITORING" || this.status == "ALERTING";
    }

    public isAlerting(): boolean {
        return this.status == "ALERTING";
    }

}
