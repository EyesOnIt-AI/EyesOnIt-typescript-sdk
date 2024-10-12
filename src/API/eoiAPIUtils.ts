import { EOIResponse } from "./eoiResponse";
import { EOIStreamInfo } from "./elements/eoiStreamInfo";
import { EyesOnItAPI } from "./EyesOnItAPI";
import { EOIMonitorStreamInputs } from "./inputs/eoiMonitorStreamInputs";
import { EOIGetVideoFrameResponse } from "./outputs/eoiGetVideoFrameResponse";
import { Logger } from "../utils/logger";
import { EOIGetAllStreamsInfoResponse } from "./outputs/eoiGetAllStreamsInfoResponse";
import { DelayUtil } from "../utils/delayUtil";

export class EOIAPIUtils {
  private logger;

  constructor(private eoiAPI: EyesOnItAPI, customLogger?: any) {
    this.logger = customLogger || new Logger();
  }

  public async getFrameFromStream(streamUrl: string): Promise<EOIGetVideoFrameResponse> {
    let getVideoFrameResponse: EOIGetVideoFrameResponse | undefined = undefined;

    let apiGetAllStreamsInfoResponse: EOIGetAllStreamsInfoResponse = await this.eoiAPI.getAllStreamsInfo();

    if (apiGetAllStreamsInfoResponse.success) {
      let streamInfo = EOIAPIUtils.getInfoForStream(apiGetAllStreamsInfoResponse.streams, streamUrl);

      if (streamInfo != null) {
        if (!streamInfo.isMonitoring()) {
          // need to monitor stream before we can get a frame
          await this.eoiAPI.monitorStream(new EOIMonitorStreamInputs(streamUrl, null));
        }

        // stream has been added and is being monitored. Get a frame.
        for (let attempt = 0; attempt < 5; attempt++) {
          getVideoFrameResponse = await this.eoiAPI.getVideoFrame(streamUrl);

          if (getVideoFrameResponse.success) {
            break;
          }
          else {
            this.logger.debug(`Attempt ${attempt + 1} failed: ${getVideoFrameResponse.message}`);
            await DelayUtil.delay(500);
          }
        }

        if (!streamInfo.isMonitoring()) {
          await this.eoiAPI.stopMonitoringStream(streamUrl);
        }
      }
      else {
        // stream not added. Get preview frame.
        getVideoFrameResponse = await this.eoiAPI.getPreviewVideoFrame(streamUrl);
      }
    }

    if (getVideoFrameResponse == undefined) {
      getVideoFrameResponse = new EOIGetVideoFrameResponse(EOIResponse.failure());
    }

    return getVideoFrameResponse;
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