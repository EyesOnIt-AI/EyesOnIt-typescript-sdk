import { EOIStreamInfo } from "./elements/eoiStreamInfo";
import { EyesOnItAPI } from "./EyesOnItAPI";
import { Logger } from "../utils/logger";

export class EOIAPIUtils {
  private logger;

  constructor(private eoiAPI: EyesOnItAPI, customLogger?: any) {
    this.logger = customLogger || new Logger();
  }

  public static getInfoForStream(streamsInfos: EOIStreamInfo[], streamUrl: string): EOIStreamInfo | null {
    let requestedStreamInfo: EOIStreamInfo | null = null;

    for (let streamInfo of streamsInfos) {
      if (streamInfo.stream_url == streamUrl) {
        requestedStreamInfo = streamInfo;
        break;
      }
    }

    return requestedStreamInfo;
  }
}