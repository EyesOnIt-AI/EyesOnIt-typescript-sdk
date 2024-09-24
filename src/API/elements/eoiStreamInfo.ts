export class EOIStreamInfo {
    public stream_url: string;
    public name: string;
    public status: string;

    public static fromJsonObj(obj: any): EOIStreamInfo {
        let streamInfo: EOIStreamInfo = new EOIStreamInfo();

        streamInfo.stream_url = obj.stream_url;
        streamInfo.name = obj.name;
        streamInfo.status = obj.status;

        return streamInfo;
    }

    public isMonitoring(): boolean {
        return this.status == "MONITORING" || this.status == "ALERTING";
    }

    public isAlerting(): boolean {
        return this.status == "ALERTING";
    }

}