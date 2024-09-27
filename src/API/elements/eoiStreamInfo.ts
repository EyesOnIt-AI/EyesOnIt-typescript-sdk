import { EOINotification } from "./eoiNotification";
import { EOIRegion } from "./eoiRegion";

export class EOIStreamInfo {
    public stream_url: string;
    public name: string;
    public frame_rate: number;
    public status: string;
    public regions: EOIRegion[];
    public notification: EOINotification | undefined;

    public static fromJsonObj(obj: any): EOIStreamInfo {
        let streamInfo: EOIStreamInfo = new EOIStreamInfo();

        streamInfo.stream_url = obj.stream_url;
        streamInfo.name = obj.name;
        streamInfo.status = obj.status;
        streamInfo.frame_rate = obj.frame_rate;

        streamInfo.regions = obj.regions?.map(EOIRegion.fromJsonObj);
        streamInfo.notification = EOINotification.fromJsonObj(obj.notification);

        return streamInfo;
    }

    public isMonitoring(): boolean {
        return this.status == "MONITORING" || this.status == "ALERTING";
    }

    public isAlerting(): boolean {
        return this.status == "ALERTING";
    }

}