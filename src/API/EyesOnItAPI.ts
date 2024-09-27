import axios, * as others from 'axios';

import { EOIResponse } from "./eoiResponse";
import { EOIAddStreamInputs } from './inputs/eoiAddStreamInputs';
import { EOIMonitorStreamInputs } from './inputs/eoiMonitorStreamInputs';
import { EOIProcessImageInputs } from './inputs/eoiProcessImageInputs';
import { EOIProcessVideoInputs } from './inputs/eoiProcessVideoInputs';
import { EOIValidation } from './inputs/eoiValidation';
import { EOIAddStreamResponse } from './outputs/eoiAddStreamResponse';
import { EOIGetLastDetectionInfoResponse } from './outputs/eoiGetLastDetectionInfoResponse';
import { EOIGetAllStreamsInfoResponse } from './outputs/eoiGetAllStreamsInfoResponse';
import { EOIGetVideoFrameResponse } from './outputs/eoiGetVideoFrameResponse';
import { EOIMonitorStreamResponse } from './outputs/eoiMonitorStreamResponse';
import { EOIProcessImageResponse } from './outputs/eoiProcessImageResponse';
import { EOIProcessVideosResponse } from './outputs/eoiProcessVideosResponse';
import { EOIRemoveStreamResponse } from './outputs/eoiRemoveStreamResponse';
import { EOIStopMonitoringStreamResponse } from './outputs/eoiStopMonitoringStreamResponse';
import { JSONUtil } from '../utils/JSONUtil';
import { ExceptionUtil } from '../utils/exceptionUtil';
import { Logger } from '../utils/logger';
import { EOIGetStreamDetailsResponse } from './outputs/eoiGetStreamDetailsResponse';
import { IEOIRESTHandler } from './REST/IEOIRESTHandler';
import { EOIAxiosRESTHandler } from './REST/EOIAxiosRESTHandler';

export class EyesOnItAPI {
    private static readonly processImagePath = "/process_image";
    private static readonly addStreamPath = "/add_stream";
    private static readonly processVideosPath = "/process_videos";
    private static readonly removeStreamPath = "/remove_stream";
    private static readonly monitorStreamPath = "/monitor_stream";
    private static readonly stopMonitorStreamPath = "/stop_monitoring";
    private static readonly getAllStreamsInfoPath = "/get_all_streams_info";
    private static readonly getStreamDetailsPath = "/get_stream_details";
    private static readonly getLastDetectionInfoPath = "/get_last_detection_info";
    private static readonly getPreviewFramePath = "/get_preview_video_frame";
    private static readonly getVideoFramePath = "/get_video_frame";

    private logger;

    constructor(private apiBasePath: string, private restHandler?: IEOIRESTHandler, customLogger?: any) {
        let logPrefix = `${this.constructor.name}.constructor`;

        if (this.restHandler == null) {
            this.restHandler = new EOIAxiosRESTHandler(customLogger);
        }

        this.logger = customLogger || new Logger();

        this.logger.debug(`${logPrefix}`);
    }

    /*
    public async processImageFromFile(inputs: EOIProcessImageInputs, filePath: string): Promise<EOIProcessImageResponse> {
        let logPrefix = `${this.constructor.name}.inferFromFile`;
        let processImageResponse: EOIProcessImageResponse = new EOIProcessImageResponse(EOIValidation.validateProcessImageInputs(inputs));

        if (processImageResponse.success) {
            if (filePath == null || filePath.length == 0) {
                processImageResponse = new EOIProcessImageResponse(new EOIResponse(false, `filePath must not be null or empty. filePath = ${filePath}`));
            }
        }

        if (processImageResponse.success) {
            // try to read the file
            let base64Image = null;

            try {
                let fileContent = fs.readFileSync(filePath);
                base64Image = fileContent.toString('base64');
            }
            catch (error: any) {
                processImageResponse = new EOIProcessImageResponse(new EOIResponse(false, `unable to read file from ${filePath}. Error = ${ExceptionUtil.getErrorMessage(error)}`));
                base64Image = null;
            }

            // set up request endpoint and body
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.processImagePath}`;

            const body: any = inputs;
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            body.file = base64Image;

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                processImageResponse = new EOIProcessImageResponse(response);
            } catch (error) {
                processImageResponse = new EOIProcessImageResponse(this.handleError(error));
            }
        }

        return processImageResponse;
    }
    */

    public async processImage(inputs: EOIProcessImageInputs): Promise<EOIProcessImageResponse> {
        let logPrefix = `${this.constructor.name}.processImage`;
        let processImageResponse: EOIProcessImageResponse = new EOIProcessImageResponse(EOIValidation.validateProcessImageInputs(inputs));

        if (processImageResponse.success) {
            if (inputs.base64Image == null || inputs.base64Image.length == 0) {
                processImageResponse = new EOIProcessImageResponse(new EOIResponse(false, `image must not be null or empty`));
            }
        }

        if (processImageResponse.success) {
            // set up request endpoint and body
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.processImagePath}`;

            const body: any = JSON.parse(inputs.stringify());
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            body.file = inputs.base64Image;

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                processImageResponse = new EOIProcessImageResponse(response);
            } catch (error) {
                processImageResponse = new EOIProcessImageResponse(this.handleError(error));
            }
        }

        return processImageResponse;
    }

    public async addStream(inputs: EOIAddStreamInputs): Promise<EOIAddStreamResponse> {
        let logPrefix = `${this.constructor.name}.addStream`;
        let addStreamResponse: EOIAddStreamResponse = new EOIAddStreamResponse(EOIValidation.validateAddStreamInputs(inputs));

        if (addStreamResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.addStreamPath}`;

            const body: any = inputs;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                addStreamResponse = new EOIAddStreamResponse(response);
            } catch (error) {
                addStreamResponse = new EOIAddStreamResponse(this.handleError(error));
            }
        }

        return addStreamResponse;
    }

    public async processVideo(inputs: EOIProcessVideoInputs): Promise<EOIProcessVideosResponse> {
        let logPrefix = `${this.constructor.name}.processVideo`;
        let processVideosResponse: EOIProcessVideosResponse = new EOIProcessVideosResponse(EOIValidation.validateProcessVideoInputs(inputs));

        if (processVideosResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.processVideosPath}`;

            const body: any = inputs;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                processVideosResponse = new EOIProcessVideosResponse(response);
            } catch (error) {
                processVideosResponse = new EOIProcessVideosResponse(this.handleError(error));
            }
        }

        return processVideosResponse;
    }

    public async removeStream(streamUrl: string): Promise<EOIRemoveStreamResponse> {
        let removeStreamResponse: EOIRemoveStreamResponse = new EOIRemoveStreamResponse(EOIValidation.validateStreamUrl(streamUrl));

        if (removeStreamResponse.success) {
            const logPrefix = `${this.constructor.name}.removeStream`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.removeStreamPath}`;

            const body: any = { stream_url: streamUrl };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                removeStreamResponse = new EOIRemoveStreamResponse(response);
            } catch (error) {
                removeStreamResponse = new EOIRemoveStreamResponse(this.handleError(error));
            }
        }

        return removeStreamResponse;
    }

    public async monitorStream(inputs: EOIMonitorStreamInputs): Promise<EOIMonitorStreamResponse> {
        let monitorStreamResponse = new EOIMonitorStreamResponse(EOIValidation.validateMonitorStreamInputs(inputs));

        if (monitorStreamResponse.success) {
            const logPrefix = `${this.constructor.name}.monitorStream`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.monitorStreamPath}`;

            const body: any = { "stream_url": inputs.streamUrl };

            if (inputs.durationSeconds != null) {
                body.duration_seconds = inputs.durationSeconds;
            }

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                monitorStreamResponse = new EOIMonitorStreamResponse(response);
            } catch (error) {
                monitorStreamResponse = new EOIMonitorStreamResponse(this.handleError(error));
            }
        }

        return monitorStreamResponse;
    }

    public async stopMonitoringStream(streamUrl: string): Promise<EOIStopMonitoringStreamResponse> {
        let stopMonitorStreamResponse = new EOIStopMonitoringStreamResponse(EOIValidation.validateStreamUrl(streamUrl));

        if (stopMonitorStreamResponse.success) {
            const logPrefix = `${this.constructor.name}.stopMonitoringStream`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.stopMonitorStreamPath}`;

            const body: any = { stream_url: streamUrl };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                stopMonitorStreamResponse = new EOIStopMonitoringStreamResponse(response);
            } catch (error) {
                stopMonitorStreamResponse = new EOIStopMonitoringStreamResponse(this.handleError(error));
            }
        }

        return stopMonitorStreamResponse;
    }

    public async getAllStreamsInfo(): Promise<EOIGetAllStreamsInfoResponse> {
        const logPrefix = `${this.constructor.name}.getAllStreamsInfo`;

        let eoiGetAllStreamsInfoResponse: EOIGetAllStreamsInfoResponse;

        const endPoint = `${this.apiBasePath}${EyesOnItAPI.getAllStreamsInfoPath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);
        eoiGetAllStreamsInfoResponse = new EOIGetAllStreamsInfoResponse(eoiResponse);

        return eoiGetAllStreamsInfoResponse;
    }

    public async getStreamDetails(streamUrl: string): Promise<EOIGetStreamDetailsResponse> {
        let eoiGetStreamDetailsResponse = new EOIGetStreamDetailsResponse(EOIValidation.validateStreamUrl(streamUrl));

        if (eoiGetStreamDetailsResponse.success) {
            const logPrefix = `${this.constructor.name}.getStreamDetails`;
            const endPoint = `${this.apiBasePath}${EyesOnItAPI.getStreamDetailsPath}`;

            const body: any = { stream_url: streamUrl };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            const response = await this.doPost(endPoint, body, logPrefix);
            eoiGetStreamDetailsResponse = new EOIGetStreamDetailsResponse(response);
        }

        return eoiGetStreamDetailsResponse;
    }

    public async getLastDetectionInfo(streamUrl: string): Promise<EOIGetLastDetectionInfoResponse> {
        let getLastDetectionInfoResponse = new EOIGetLastDetectionInfoResponse(EOIValidation.validateStreamUrl(streamUrl));

        if (getLastDetectionInfoResponse.success) {
            const logPrefix = `${this.constructor.name}.getLastDetectionInfo`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.getLastDetectionInfoPath}`;

            const body: any = { stream_url: streamUrl };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                getLastDetectionInfoResponse = new EOIGetLastDetectionInfoResponse(response);
            } catch (error) {
                getLastDetectionInfoResponse = new EOIGetLastDetectionInfoResponse(this.handleError(error));
            }
        }

        return getLastDetectionInfoResponse;
    }

    public async getPreviewVideoFrame(streamUrl: string): Promise<EOIGetVideoFrameResponse> {
        let getPreviewFrameResponse = new EOIGetVideoFrameResponse(EOIValidation.validateStreamUrl(streamUrl));

        if (getPreviewFrameResponse.success) {
            const logPrefix = `${this.constructor.name}.getPreviewFrame`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.getPreviewFramePath}`;

            const body: any = { stream_url: streamUrl };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                getPreviewFrameResponse = new EOIGetVideoFrameResponse(response);
            } catch (error) {
                getPreviewFrameResponse = new EOIGetVideoFrameResponse(this.handleError(error));
            }
        }

        return getPreviewFrameResponse;
    }

    public async getVideoFrame(streamUrl: string): Promise<EOIGetVideoFrameResponse> {
        let getVideoFrameResponse = new EOIGetVideoFrameResponse(EOIValidation.validateStreamUrl(streamUrl));

        if (getVideoFrameResponse.success) {
            const logPrefix = `${this.constructor.name}.getVideoFrame`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.getVideoFramePath}`;

            const body: any = { stream_url: streamUrl };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                getVideoFrameResponse = new EOIGetVideoFrameResponse(response);
            } catch (error) {
                getVideoFrameResponse = new EOIGetVideoFrameResponse(this.handleError(error));
            }
        }

        return getVideoFrameResponse;
    }

    private async doGet(endPoint: string): Promise<EOIResponse> {
        let apiResponse: EOIResponse | undefined = undefined;

        if (this.restHandler == null) {
            apiResponse = new EOIResponse(false, "REST handler not defined");
        }
        else {
            apiResponse = await this.restHandler.get(endPoint);
        }

        return apiResponse;
    }

    private async doPost(endPoint: string, body: any, callerLogPrefix: string): Promise<EOIResponse> {
        const thisLogPrefix = `${this.constructor.name}.doPost`;
        let apiResponse: EOIResponse | undefined = undefined;

        const headers = {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        };

        if (this.restHandler == null) {
            apiResponse = new EOIResponse(false, "REST handler not defined");
        }
        else {
            apiResponse = await this.restHandler.post(endPoint, body, headers);
        }

        return apiResponse;
    }

    private handleSuccess(response: any): EOIResponse {
        let apiResponse = new EOIResponse(response.success, response.message);
        apiResponse.data = response.data;

        return apiResponse;
    }

    private handleError(error: any): EOIResponse {
        let logPrefix = `${this.constructor.name}.handleError`;

        this.logger.error(`${logPrefix}: error: ${error}`);

        if (error.response) {
            this.logger.error(`${logPrefix}: error detail: ${JSONUtil.stringifyWithoutCircularLinks(error.response.data)}`);
        }

        return new EOIResponse(false, `error: ${ExceptionUtil.getErrorMessage(error)}`);
    }
}

