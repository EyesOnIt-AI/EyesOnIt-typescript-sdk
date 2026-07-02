import { EOILine } from "./eoiLine";
import { EOINotification } from "./eoiNotification";
import { EOIRecording } from "./eoiRecording";
import { EOIRegion } from "./eoiRegion";
import { EOICameraCalibration } from "./eoiCameraCalibration";

export class EOIStreamInfo {
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

    public static fromJsonObj(obj: any): EOIStreamInfo {
        let streamInfo: EOIStreamInfo = new EOIStreamInfo();
        streamInfo.initFromJson(obj);

        return streamInfo;
    }

    public initFromJson(obj: any) {
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
    }

    public isMonitoring(): boolean {
        return this.status == "MONITORING" || this.status == "ALERTING";
    }

    public isAlerting(): boolean {
        return this.status == "ALERTING";
    }

}
