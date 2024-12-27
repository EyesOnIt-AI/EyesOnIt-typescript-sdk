import { EOILine } from "./eoiLine";
import { EOINotification } from "./eoiNotification";
import { EOIRecording } from "./eoiRecording";
import { EOIRegion } from "./eoiRegion";

export class EOIStreamInfo {
    public stream_url: string;
    public name: string;
    public frame_rate: number;
    public status: string;
    public regions: EOIRegion[];
    public lines: EOILine[];
    public notification: EOINotification | undefined;
    public recording: EOIRecording | undefined;

    public static fromJsonObj(obj: any): EOIStreamInfo {
        let streamInfo: EOIStreamInfo = new EOIStreamInfo();
        streamInfo.initFromJson(obj);

        return streamInfo;
    }

    public initFromJson(obj: any) {
        this.stream_url = obj.stream_url;
        this.name = obj.name;
        this.status = obj.status;
        this.frame_rate = obj.frame_rate;

        this.regions = obj.regions != null ? obj.regions.map(EOIRegion.fromJsonObj) : [];
        this.lines = obj.lines != null ? obj.lines.map(EOILine.fromJsonObj) : [];
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