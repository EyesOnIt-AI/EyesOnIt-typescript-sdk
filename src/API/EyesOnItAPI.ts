
import { ExceptionUtil } from '../utils/exceptionUtil';
import { JSONUtil } from '../utils/JSONUtil';
import { Logger } from '../utils/logger';
import { EOIResponse } from "./eoiResponse";
import { EOIAddStreamInputs } from './inputs/eoiAddStreamInputs';
import { EOIUpdateLiveSearchInputs } from './inputs/eoiUpdateLiveSearchInputs';
import { EOIMonitorStreamInputs } from './inputs/eoiMonitorStreamInputs';
import { EOIProcessImageInputs } from './inputs/eoiProcessImageInputs';
import { EOIProcessVideoInputs } from './inputs/eoiProcessVideoInputs';
import { EOIGetVideoStatusInputs } from './inputs/eoiGetVideoStatusInputs';
import { EOIArchiveSearchInputs } from './inputs/eoiArchiveSearchInputs';
import { EOIGetInteractionEventSummaryInputs, EOIGetInteractionEventsInputs, EOIUpdateInteractionEventStatusInputs } from './inputs/eoiInteractionEventInputs';
import { EOILiveSearchInputs } from './inputs/eoiLiveSearchInputs';
import { EOIStopVideoInputs } from './inputs/eoiStopVideoInputs';
import { EOIUpdateConfigInputs } from './inputs/eoiUpdateConfigInputs';
import { EOIValidator } from './eoiValidator';
import { EOIValidateLicenseInputs } from './inputs/eoiValidateLicenseInputs';
import { EOIAddStreamResponse } from './outputs/eoiAddStreamResponse';
import { EOIGetConfigResponse } from './outputs/eoiGetConfigResponse';
import { EOIGetAllStreamsInfoResponse } from './outputs/eoiGetAllStreamsInfoResponse';
import { EOIGetLastDetectionInfoResponse } from './outputs/eoiGetLastDetectionInfoResponse';
import { EOIGetStreamDetailsResponse } from './outputs/eoiGetStreamDetailsResponse';
import { EOIGetSupportedClassesResponse } from './outputs/eoiGetSupportedClassesResponse';
import { EOIGetVideoStatusResponse } from './outputs/eoiGetVideoStatusResponse';
import { EOIGetVideoFrameResponse } from './outputs/eoiGetVideoFrameResponse';
import { EOIHealthResponse } from './outputs/eoiHealthResponse';
import { EOIGetInteractionEventSummaryResponse, EOIGetInteractionEventsResponse, EOIUpdateInteractionEventStatusResponse } from './outputs/eoiInteractionEventResponses';
import { EOILicenseStatusResponse } from './outputs/eoiLicenseStatusResponse';
import { EOILicenseValidityResponse } from './outputs/eoiLicenseValidityResponse';
import { EOILiveSearchResponse } from './outputs/eoiLiveSearchResponse';
import { EOIMonitorStreamResponse } from './outputs/eoiMonitorStreamResponse';
import { EOIProcessImageResponse } from './outputs/eoiProcessImageResponse';
import { EOIProcessVideoResponse as EOIProcessVideoResponse } from './outputs/eoiProcessVideoResponse';
import { EOIRemoveStreamResponse } from './outputs/eoiRemoveStreamResponse';
import { EOISearchResponse } from './outputs/eoiSearchResponse';
import { EOIStopMonitoringStreamResponse } from './outputs/eoiStopMonitoringStreamResponse';
import { EOIStopVideoResponse } from './outputs/eoiStopVideoResponse';
import { EOIUpdateConfigResponse } from './outputs/eoiUpdateConfigResponse';
import { EOIAxiosRESTHandler } from './REST/EOIAxiosRESTHandler';
import { IEOIRESTHandler } from './REST/IEOIRESTHandler';
import { EOIGetFacerecGroupsResponse } from './outputs/eoiGetFacerecGroupsResponse';
import { EOISearchFacerecNamesResponse } from './outputs/eoiSearchFacerecNamesResponse';
import { EOIBaseOutputs } from './outputs/eoiBaseOutputs';
import { EOIAddFacerecGroupInputs } from './inputs/eoiAddFacerecGroupInputs';
import { EOIRemoveFacerecGroupResponse } from './outputs/eoiRemoveFacerecGroupResponse';
import { EOIAddFacerecPersonInputs } from './inputs/eoiAddFacerecPersonInputs';
import { EOIFacerecPersonDetailsResponse } from './outputs/eoiFacerecPersonDetailsResponse';
import { EOIAddFacerecPeopleInputs } from './inputs/eoiAddFacerecPeopleInputs';
import { EOI_CURRENT_SCHEMA_VERSION } from './eoiSchemaVersion';

/**
 * Client for the EyesOnIt REST API.
 *
 * This class wraps the HTTP endpoints exposed by EyesOnIt and returns typed response
 * objects for each operation.
 */
export class EyesOnItAPI {
    private static readonly processImagePath = "/process_image";
    private static readonly addStreamPath = "/add_stream";
    private static readonly processVideoPath = "/process_video";
    private static readonly stopVideoPath = "/stop_video";
    private static readonly getVideoStatusPath = "/get_video_status";
    private static readonly removeStreamPath = "/remove_stream";
    private static readonly monitorStreamPath = "/monitor_stream";
    private static readonly stopMonitorStreamPath = "/stop_monitoring";
    private static readonly getAllStreamsInfoPath = "/get_all_streams_info";
    private static readonly getStreamDetailsPath = "/get_stream_details";
    private static readonly getSupportedClassesPath = "/get_supported_classes";
    private static readonly getLastDetectionInfoPath = "/get_last_detection_info";
    private static readonly getVideoFramePath = "/get_video_frame";
    private static readonly getInteractionEventsPath = "/get_interaction_events";
    private static readonly getInteractionEventSummaryPath = "/get_interaction_event_summary";
    private static readonly updateInteractionEventStatusPath = "/update_interaction_event_status";
    private static readonly searchLivePath = "/live_search";
    private static readonly searchArchivePath = "/archive_search";
    private static readonly pauseLiveSearchPath = "/pause_live_search";
    private static readonly resumeLiveSearchPath = "/resume_live_search";
    private static readonly cancelLiveSearchPath = "/cancel_live_search";
    private static readonly getConfigPath = "/get_config";
    private static readonly updateConfigPath = "/update_config";
    private static readonly facerecGroupsPath = "/facerec_groups";
    private static readonly facerecSearchGroupNamesPath = "/facerec_search_group_names";
    private static readonly facerecSearchPeopleNamesPath = "/facerec_search_people_names";
    private static readonly facerecAddGroupPath = "/facerec_add_group";
    private static readonly facerecRemoveGroupPath = "/facerec_remove_group";
    private static readonly facerecAddPersonPath = "/facerec_add_person";
    private static readonly facerecAddPeoplePath = "/facerec_add_people";
    private static readonly facerecRemovePersonPath = "/facerec_remove_person";
    private static readonly facerecPersonDetails = "/facerec_person_details";
    private static readonly healthPath = "/health";
    private static readonly isEoiAlivePath = "/is_eoi_alive";
    private static readonly isLicenseValidPath = "/is_license_valid";
    private static readonly getLicenseStatusPath = "/get_license_status";
    private static readonly validateLicensePath = "/validate_license";
    
    private logger;

    /**
     * Creates an API client instance.
     *
     * @param apiBasePath Base URL for the EyesOnIt API, for example `http://localhost:8000`.
     * @param restHandler Optional custom REST handler. If omitted, Axios is used.
     * @param customLogger Optional logger implementation. Defaults to an internal logger.
     */
    constructor(private apiBasePath: string, private restHandler?: IEOIRESTHandler, customLogger?: any) {
        let logPrefix = `${this.constructor.name}.constructor`;

        if (this.restHandler == null) {
            this.restHandler = new EOIAxiosRESTHandler(customLogger);
        }

        this.logger = customLogger || new Logger();

        this.logger.debug(`${logPrefix}`);
    }

    /**
     * Returns the configured API base URL for this client.
     */
    public getBaseUrl(): string {
        return this.apiBasePath;
    }

    /**
     * Returns server health metrics.
     *
     * @returns A typed response containing GPU, system, and raw health payload data.
     * @remarks Endpoint: `GET /health`
     */
    public async health(): Promise<EOIHealthResponse> {
        const logPrefix = `${this.constructor.name}.health`;

        const endPoint = `${this.apiBasePath}${EyesOnItAPI.healthPath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);

        this.logger.debug(`${logPrefix}: ${endPoint} response: ${JSON.stringify(eoiResponse)}`);

        return new EOIHealthResponse(eoiResponse);
    }

    /**
     * Checks whether the EyesOnIt API process is alive.
     *
     * @returns Base API response indicating liveness.
     * @remarks Endpoint: `GET /is_eoi_alive`
     */
    public async isEoiAlive(): Promise<EOIBaseOutputs> {
        const logPrefix = `${this.constructor.name}.isEoiAlive`;
        const endPoint = `${this.apiBasePath}${EyesOnItAPI.isEoiAlivePath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);

        this.logger.debug(`${logPrefix}: ${endPoint} response success: ${eoiResponse.success}`);

        return new EOIBaseOutputs(eoiResponse);
    }

    /**
     * Checks whether the configured license is valid.
     *
     * @returns A typed response containing entered/valid license booleans.
     * @remarks Endpoint: `GET /is_license_valid`
     */
    public async isLicenseValid(): Promise<EOILicenseValidityResponse> {
        const logPrefix = `${this.constructor.name}.isLicenseValid`;
        const endPoint = `${this.apiBasePath}${EyesOnItAPI.isLicenseValidPath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);

        this.logger.debug(`${logPrefix}: ${endPoint} response success: ${eoiResponse.success}`);

        return new EOILicenseValidityResponse(eoiResponse);
    }

    /**
     * Returns the current license status.
     *
     * @returns A typed response containing license status fields.
     * @remarks Endpoint: `GET /get_license_status`
     */
    public async getLicenseStatus(): Promise<EOILicenseStatusResponse> {
        const logPrefix = `${this.constructor.name}.getLicenseStatus`;
        const endPoint = `${this.apiBasePath}${EyesOnItAPI.getLicenseStatusPath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);

        this.logger.debug(`${logPrefix}: ${endPoint} response success: ${eoiResponse.success}`);

        return new EOILicenseStatusResponse(eoiResponse);
    }

    /**
     * Validates and applies a license.
     *
     * @param inputs License key and validation token.
     * @returns A typed response containing the resulting license status.
     * @remarks Endpoint: `POST /validate_license`
     */
    public async validateLicense(inputs: EOIValidateLicenseInputs): Promise<EOILicenseStatusResponse> {
        const logPrefix = `${this.constructor.name}.validateLicense`;
        let validateLicenseResponse = new EOILicenseStatusResponse(
            inputs == null ? new EOIResponse(false, "inputs = null. Validate license request must include inputs") : inputs.validate()
        );

        if (validateLicenseResponse.success) {
            const endPoint = `${this.apiBasePath}${EyesOnItAPI.validateLicensePath}`;
            const body: any = { key: inputs.key, token: inputs.token };

            this.logger.debug(`${logPrefix}: calling ${endPoint}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                validateLicenseResponse = new EOILicenseStatusResponse(response);
                this.logger.debug(`${logPrefix}: ${endPoint} response success: ${response.success}`);
            } catch (error) {
                validateLicenseResponse = new EOILicenseStatusResponse(this.handleError(error));
            }
        }

        return validateLicenseResponse;
    }


    /**
     * Processes a single image with the detection configuration defined in the request.
     *
     * @param inputs Image and detection configuration payload.
     * @returns A typed response containing success state, message, and image detections.
     * @remarks Endpoint: `POST /process_image`
     */
    public async processImage(inputs: EOIProcessImageInputs): Promise<EOIProcessImageResponse> {
        let logPrefix = `${this.constructor.name}.processImage`;
        let processImageResponse: EOIProcessImageResponse = new EOIProcessImageResponse(EOIValidator.validateProcessImageInputs(inputs));

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

    /**
     * Registers a stream for monitoring and detection.
     *
     * @param inputs Stream URL and monitoring configuration.
     * @returns A typed response containing stream registration results.
     * @remarks Endpoint: `POST /add_stream`
     */
    public async addStream(inputs: EOIAddStreamInputs): Promise<EOIAddStreamResponse> {
        let logPrefix = `${this.constructor.name}.addStream`;
        let addStreamResponse: EOIAddStreamResponse = new EOIAddStreamResponse(EOIValidator.validateAddStreamInputs(inputs));

        if (addStreamResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.addStreamPath}`;

            const body: any = inputs.toRequestBody();

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

    /**
     * Submits a video for asynchronous processing with the supplied detection settings.
     *
     * @param inputs Video metadata and detection configuration.
     * @returns A typed response containing processing status details.
     * @remarks Endpoint: `POST /process_video`
     */
    public async processVideo(inputs: EOIProcessVideoInputs): Promise<EOIProcessVideoResponse> {
        let logPrefix = `${this.constructor.name}.processVideo`;
        let processVideosResponse: EOIProcessVideoResponse = new EOIProcessVideoResponse(EOIValidator.validateProcessVideoInputs(inputs));

        if (processVideosResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.processVideoPath}`;

            const body: any = inputs;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                processVideosResponse = new EOIProcessVideoResponse(response);
            } catch (error) {
                processVideosResponse = new EOIProcessVideoResponse(this.handleError(error));
            }
        }

        return processVideosResponse;
    }

    /**
     * Stops one video processing job, or all active video processing jobs when no ID is provided.
     *
     * @param inputs Optional video identifier payload.
     * @returns A typed response containing the stopped video identifier, when supplied.
     * @remarks Endpoint: `POST /stop_video`
     */
    public async stopVideo(inputs: EOIStopVideoInputs = new EOIStopVideoInputs(null)): Promise<EOIStopVideoResponse> {
        let logPrefix = `${this.constructor.name}.stopVideo`;
        let stopVideoResponse = new EOIStopVideoResponse(
            inputs == null ? new EOIResponse(false, "inputs = null. Stop video request must include inputs") : inputs.validate()
        );

        if (stopVideoResponse.success) {
            const endPoint = `${this.apiBasePath}${EyesOnItAPI.stopVideoPath}`;
            const body: any = inputs.video_id == null ? {} : { video_id: inputs.video_id };

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                stopVideoResponse = new EOIStopVideoResponse(response);
            } catch (error) {
                stopVideoResponse = new EOIStopVideoResponse(this.handleError(error));
            }
        }

        return stopVideoResponse;
    }

    /**
     * Returns status for one video processing job.
     *
     * @param inputs Video identifier payload.
     * @returns A typed response containing the raw video status payload.
     * @remarks Endpoint: `POST /get_video_status`
     */
    public async getVideoStatus(inputs: EOIGetVideoStatusInputs): Promise<EOIGetVideoStatusResponse> {
        let logPrefix = `${this.constructor.name}.getVideoStatus`;
        let getVideoStatusResponse = new EOIGetVideoStatusResponse(
            inputs == null ? new EOIResponse(false, "inputs = null. Get video status request must include inputs") : inputs.validate()
        );

        if (getVideoStatusResponse.success) {
            const endPoint = `${this.apiBasePath}${EyesOnItAPI.getVideoStatusPath}`;
            const body: any = { video_id: inputs.video_id };

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                getVideoStatusResponse = new EOIGetVideoStatusResponse(response);
            } catch (error) {
                getVideoStatusResponse = new EOIGetVideoStatusResponse(this.handleError(error));
            }
        }

        return getVideoStatusResponse;
    }

    /**
     * Removes a previously registered stream.
     *
     * @param streamUrl RTSP stream URL to remove.
     * @returns A typed response indicating whether the stream was removed.
     * @remarks Endpoint: `POST /remove_stream`
     */
    public async removeStream(streamUrl: string): Promise<EOIRemoveStreamResponse> {
        let removeStreamResponse: EOIRemoveStreamResponse = new EOIRemoveStreamResponse(EOIValidator.validateStreamUrl(streamUrl));

        if (removeStreamResponse.success) {
            const logPrefix = `${this.constructor.name}.removeStream`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.removeStreamPath}`;

            const body: any = { stream_url: streamUrl, schema_version: EOI_CURRENT_SCHEMA_VERSION };
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

    /**
     * Starts monitoring a stream that has already been added.
     *
     * @param inputs Stream identifier and optional duration.
     * @returns A typed response containing monitor start status.
     * @remarks Endpoint: `POST /monitor_stream`
     */
    public async monitorStream(inputs: EOIMonitorStreamInputs): Promise<EOIMonitorStreamResponse> {
        let monitorStreamResponse = new EOIMonitorStreamResponse(EOIValidator.validateMonitorStreamInputs(inputs));

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

    /**
     * Stops active monitoring for a stream.
     *
     * @param streamUrl RTSP stream URL to stop monitoring.
     * @returns A typed response indicating whether monitoring stopped.
     * @remarks Endpoint: `POST /stop_monitoring`
     */
    public async stopMonitoringStream(streamUrl: string): Promise<EOIStopMonitoringStreamResponse> {
        let stopMonitorStreamResponse = new EOIStopMonitoringStreamResponse(EOIValidator.validateStreamUrl(streamUrl));

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

    /**
     * Returns summary information for all registered streams.
     *
     * @returns A typed response with stream information records.
     * @remarks Endpoint: `GET /get_all_streams_info`
     */
    public async getAllStreamsInfo(): Promise<EOIGetAllStreamsInfoResponse> {
        const logPrefix = `${this.constructor.name}.getAllStreamsInfo`;

        let eoiGetAllStreamsInfoResponse: EOIGetAllStreamsInfoResponse;

        const endPoint = `${this.apiBasePath}${EyesOnItAPI.getAllStreamsInfoPath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);

        this.logger.debug(`${logPrefix}: ${endPoint} response: ${JSON.stringify(eoiResponse)}`);

        eoiGetAllStreamsInfoResponse = new EOIGetAllStreamsInfoResponse(eoiResponse);

        return eoiGetAllStreamsInfoResponse;
    }

    /**
     * Returns detailed status and configuration for a single stream.
     *
     * @param streamUrl RTSP stream URL to query.
     * @returns A typed response with detailed stream information.
     * @remarks Endpoint: `POST /get_stream_details`
     */
    public async getStreamDetails(streamUrl: string): Promise<EOIGetStreamDetailsResponse> {
        let eoiGetStreamDetailsResponse = new EOIGetStreamDetailsResponse(EOIValidator.validateStreamUrl(streamUrl));

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

    /**
     * Returns the class names supported by the EyesOnIt server.
     *
     * @returns A typed response containing supported class names.
     * @remarks Endpoint: `GET /get_supported_classes`
     */
    public async getSupportedClasses(): Promise<EOIGetSupportedClassesResponse> {
        const logPrefix = `${this.constructor.name}.getSupportedClasses`;

        let getSupportedClassesResponse: EOIGetSupportedClassesResponse;

        const endPoint = `${this.apiBasePath}${EyesOnItAPI.getSupportedClassesPath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);

        this.logger.debug(`${logPrefix}: ${endPoint} response: ${JSON.stringify(eoiResponse)}`);

        getSupportedClassesResponse = new EOIGetSupportedClassesResponse(eoiResponse);

        return getSupportedClassesResponse;
    }

    /**
     * Returns the most recent detection information for a stream.
     *
     * @param streamUrl RTSP stream URL to query.
     * @returns A typed response with the latest detection payload.
     * @remarks Endpoint: `POST /get_last_detection_info`
     */
    public async getLastDetectionInfo(streamUrl: string): Promise<EOIGetLastDetectionInfoResponse> {
        let getLastDetectionInfoResponse = new EOIGetLastDetectionInfoResponse(EOIValidator.validateStreamUrl(streamUrl));

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

    /**
     * Returns persisted region-level interaction candidate events.
     *
     * @param inputs Optional stream, time, type, status, and pagination filters.
     * @returns A typed response containing event records and total count.
     * @remarks Endpoint: `POST /get_interaction_events`
     */
    public async getInteractionEvents(inputs?: EOIGetInteractionEventsInputs): Promise<EOIGetInteractionEventsResponse> {
        const logPrefix = `${this.constructor.name}.getInteractionEvents`;
        const endPoint = `${this.apiBasePath}${EyesOnItAPI.getInteractionEventsPath}`;
        const body: any = inputs ?? new EOIGetInteractionEventsInputs();

        this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

        try {
            const response = await this.doPost(endPoint, body, logPrefix);
            return new EOIGetInteractionEventsResponse(response);
        } catch (error) {
            return new EOIGetInteractionEventsResponse(this.handleError(error));
        }
    }

    /**
     * Returns summary counts for persisted interaction candidate events.
     *
     * @param inputs Optional stream, time, type, and status filters.
     * @returns A typed response containing grouped event counts.
     * @remarks Endpoint: `POST /get_interaction_event_summary`
     */
    public async getInteractionEventSummary(inputs?: EOIGetInteractionEventSummaryInputs): Promise<EOIGetInteractionEventSummaryResponse> {
        const logPrefix = `${this.constructor.name}.getInteractionEventSummary`;
        const endPoint = `${this.apiBasePath}${EyesOnItAPI.getInteractionEventSummaryPath}`;
        const body: any = inputs ?? new EOIGetInteractionEventSummaryInputs();

        this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

        try {
            const response = await this.doPost(endPoint, body, logPrefix);
            return new EOIGetInteractionEventSummaryResponse(response);
        } catch (error) {
            return new EOIGetInteractionEventSummaryResponse(this.handleError(error));
        }
    }

    /**
     * Updates review status for one persisted interaction candidate event.
     *
     * @param inputs Event ID, review status, and optional reviewer note.
     * @returns A typed response containing the updated event when found.
     * @remarks Endpoint: `POST /update_interaction_event_status`
     */
    public async updateInteractionEventStatus(inputs: EOIUpdateInteractionEventStatusInputs): Promise<EOIUpdateInteractionEventStatusResponse> {
        const logPrefix = `${this.constructor.name}.updateInteractionEventStatus`;
        const endPoint = `${this.apiBasePath}${EyesOnItAPI.updateInteractionEventStatusPath}`;
        const body: any = inputs;

        this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

        try {
            const response = await this.doPost(endPoint, body, logPrefix);
            return new EOIUpdateInteractionEventStatusResponse(response);
        } catch (error) {
            return new EOIUpdateInteractionEventStatusResponse(this.handleError(error));
        }
    }

    /**
     * Retrieves the latest frame for a stream.
     *
     * @param streamUrl RTSP stream URL to query.
     * @returns A typed response that includes a frame image payload.
     * @remarks Endpoint: `POST /get_video_frame`
     */
    public async getVideoFrame(streamUrl: string): Promise<EOIGetVideoFrameResponse> {
        let getVideoFrameResponse = new EOIGetVideoFrameResponse(EOIValidator.validateStreamUrl(streamUrl));

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

    /**
     * Executes a search over archived detections and recordings.
     *
     * @param inputs Archive search criteria and filters.
     * @returns A typed response containing matching results.
     * @remarks Endpoint: `POST /archive_search`
     */
    public async searchArchive(inputs: EOIArchiveSearchInputs): Promise<EOISearchResponse> {
        let logPrefix = `${this.constructor.name}.search`;
        let searchResponse: EOISearchResponse = new EOISearchResponse(EOIValidator.validateArchiveSearchInputs(inputs));

        if (searchResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.searchArchivePath}`;

            const body: any = inputs;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                searchResponse = new EOISearchResponse(response);
            } catch (error) {
                searchResponse = new EOISearchResponse(this.handleError(error));
            }
        }

        return searchResponse;
    }

    /**
     * Starts a live search task against active streams.
     *
     * @param inputs Live search configuration and criteria.
     * @returns A typed response containing the live search identifier and status.
     * @remarks Endpoint: `POST /live_search`
     */
    public async searchLive(inputs: EOILiveSearchInputs): Promise<EOILiveSearchResponse> {
        let logPrefix = `${this.constructor.name}.liveSearch`;
        let liveSearchResponse: EOILiveSearchResponse = new EOILiveSearchResponse(EOIValidator.validateLiveSearchInputs(inputs));

        if (liveSearchResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.searchLivePath}`;

            const body: any = inputs;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                liveSearchResponse = new EOILiveSearchResponse(response);
            } catch (error) {
                liveSearchResponse = new EOILiveSearchResponse(this.handleError(error));
            }
        }

        return liveSearchResponse;
    }

    /**
     * Pauses one live search task or all live search tasks.
     *
     * @param inputs Search identifier payload. Use `-1` to target all searches.
     * @returns Base API response indicating pause status.
     * @remarks Endpoint: `POST /pause_live_search`
     */
    public async pauseLiveSearch(inputs: EOIUpdateLiveSearchInputs): Promise<EOIResponse> {
        let logPrefix = `${this.constructor.name}.pauseLiveSearch`;
        let updateLiveSearchResponse: EOIResponse = EOIValidator.validateUpdateLiveSearchInputs(inputs);

        if (updateLiveSearchResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.pauseLiveSearchPath}`;

            const body: any = inputs;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                updateLiveSearchResponse = response;
            } catch (error) {
                updateLiveSearchResponse = this.handleError(error);
            }
        }

        return updateLiveSearchResponse;
    }

    /**
     * Resumes one paused live search task or all paused live search tasks.
     *
     * @param inputs Search identifier payload. Use `-1` to target all searches.
     * @returns Base API response indicating resume status.
     * @remarks Endpoint: `POST /resume_live_search`
     */
    public async resumeLiveSearch(inputs: EOIUpdateLiveSearchInputs): Promise<EOIResponse> {
        let logPrefix = `${this.constructor.name}.resumeLiveSearch`;
        let updateLiveSearchResponse: EOIResponse = EOIValidator.validateUpdateLiveSearchInputs(inputs);

        if (updateLiveSearchResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.resumeLiveSearchPath}`;

            const body: any = inputs;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                updateLiveSearchResponse = response;
            } catch (error) {
                updateLiveSearchResponse = this.handleError(error);
            }
        }

        return updateLiveSearchResponse;
    }

    /**
     * Cancels one live search task or all live search tasks.
     *
     * @param inputs Search identifier payload. Use `-1` to target all searches.
     * @returns Base API response indicating cancel status.
     * @remarks Endpoint: `POST /cancel_live_search`
     */
    public async cancelLiveSearch(inputs: EOIUpdateLiveSearchInputs): Promise<EOIResponse> {
        let logPrefix = `${this.constructor.name}.cancelLiveSearch`;
        let cancelLiveSearchResponse: EOIResponse = EOIValidator.validateUpdateLiveSearchInputs(inputs);

        if (cancelLiveSearchResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.cancelLiveSearchPath}`;

            const body: any = inputs;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                cancelLiveSearchResponse = response;
            } catch (error) {
                cancelLiveSearchResponse = this.handleError(error);
            }
        }

        return cancelLiveSearchResponse;
    }

    /**
     * Returns the current runtime configuration.
     *
     * @returns A typed response containing the raw configuration payload.
     * @remarks Endpoint: `GET /get_config`
     */
    public async getConfig(): Promise<EOIGetConfigResponse> {
        const logPrefix = `${this.constructor.name}.getConfig`;
        const endPoint = `${this.apiBasePath}${EyesOnItAPI.getConfigPath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);

        this.logger.debug(`${logPrefix}: ${endPoint} response success: ${eoiResponse.success}`);

        return new EOIGetConfigResponse(eoiResponse);
    }

    /**
     * Updates runtime configuration on the EyesOnIt server.
     *
     * @param inputs Typed wrapper for the configuration payload accepted by the `/update_config` endpoint.
     * @returns A typed response containing update status details.
     * @remarks Endpoint: `POST /update_config`
     */
    public async updateConfig(inputs: EOIUpdateConfigInputs): Promise<EOIUpdateConfigResponse> {
        let logPrefix = `${this.constructor.name}.updateConfig`;
        let updateConfigResponse: EOIUpdateConfigResponse = new EOIUpdateConfigResponse(inputs.validate());

        if (updateConfigResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.updateConfigPath}`;

            const body = inputs.body;

            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                updateConfigResponse = new EOIUpdateConfigResponse(response);
            } catch (error) {
                updateConfigResponse = new EOIUpdateConfigResponse(this.handleError(error));
            }
        }

        return updateConfigResponse;
    }

    /**
     * Lists face recognition groups.
     *
     * @returns A typed response containing all configured face recognition groups.
     * @remarks Endpoint: `GET /facerec_groups`
     */
    public async getFacerecGroups(): Promise<EOIGetFacerecGroupsResponse> {
        const logPrefix = `${this.constructor.name}.getFacerecGroups`;

        let eoiGetFacerecGroupsResponse: EOIGetFacerecGroupsResponse;

        const endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecGroupsPath}`;

        this.logger.debug(`${logPrefix}: Calling ${endPoint}`);

        const eoiResponse: EOIResponse = await this.doGet(endPoint);

        this.logger.debug(`${logPrefix}: ${endPoint} response: ${JSON.stringify(eoiResponse)}`);

        eoiGetFacerecGroupsResponse = new EOIGetFacerecGroupsResponse(eoiResponse);

        return eoiGetFacerecGroupsResponse;
    }

    /**
     * Creates a face recognition group.
     *
     * @param inputs Group identifier, display name, and description.
     * @returns Base typed response indicating creation status.
     * @remarks Endpoint: `POST /facerec_add_group`
     */
    public async addFacerecGroup(inputs: EOIAddFacerecGroupInputs): Promise<EOIBaseOutputs> {
        let addFacerecGroupResponse = new EOIBaseOutputs(EOIValidator.validateNewFacerecGroup(inputs));

        if (addFacerecGroupResponse.success) {
            const logPrefix = `${this.constructor.name}.addFacerecGroup`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecAddGroupPath}`;

            const body: any = inputs;
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                addFacerecGroupResponse = new EOIBaseOutputs(response);
            } catch (error) {
                addFacerecGroupResponse = new EOIBaseOutputs(this.handleError(error));
            }
        }

        return addFacerecGroupResponse;
    }

    /**
     * Deletes a face recognition group.
     *
     * @param group_id Group identifier to remove.
     * @returns A typed response indicating whether the group was removed.
     * @remarks Endpoint: `POST /facerec_remove_group`
     */
    public async removeFacerecGroup(group_id: string): Promise<EOIRemoveFacerecGroupResponse> {
        let removeFacerecGroupResponse = new EOIRemoveFacerecGroupResponse(EOIValidator.validateRemoveFacerecGroupInputs(group_id));

        if (removeFacerecGroupResponse.success) {
            const logPrefix = `${this.constructor.name}.removeFacerecGroup`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecRemoveGroupPath}`;

            const body: any = { group_id: group_id };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                removeFacerecGroupResponse = new EOIRemoveFacerecGroupResponse(response);
            } catch (error) {
                removeFacerecGroupResponse = new EOIRemoveFacerecGroupResponse(this.handleError(error));
            }
        }

        return removeFacerecGroupResponse;
    }

    /**
     * Creates a face recognition person profile and attaches images/groups.
     *
     * @param inputs Person identifier, display name, groups, and images.
     * @returns Base typed response indicating creation status.
     * @remarks Endpoint: `POST /facerec_add_person`
     */
    public async addFacerecPerson(inputs: EOIAddFacerecPersonInputs): Promise<EOIBaseOutputs> {
        let addFacerecPersonResponse = new EOIBaseOutputs(EOIValidator.validateNewFacerecPerson(inputs));

        if (addFacerecPersonResponse.success) {
            const logPrefix = `${this.constructor.name}.addFacerecPerson`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecAddPersonPath}`;

            const body: any = inputs;
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                addFacerecPersonResponse = new EOIBaseOutputs(response);
            } catch (error) {
                addFacerecPersonResponse = new EOIBaseOutputs(this.handleError(error));
            }
        }

        return addFacerecPersonResponse;
    }

    /**
     * Bulk imports face recognition people from a file.
     *
     * @param inputs File path payload for bulk person import.
     * @returns Base typed response indicating import status.
     * @remarks Endpoint: `POST /facerec_add_people`
     */
    public async addFacerecPeople(inputs: EOIAddFacerecPeopleInputs): Promise<EOIBaseOutputs> {
        let addFacerecPeopleResponse = new EOIBaseOutputs(EOIValidator.validateAddFacerecPeople(inputs));

        if (addFacerecPeopleResponse.success) {
            const logPrefix = `${this.constructor.name}.addFacerecPeople`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecAddPeoplePath}`;

            const body: any = inputs;
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                addFacerecPeopleResponse = new EOIBaseOutputs(response);
            } catch (error) {
                addFacerecPeopleResponse = new EOIBaseOutputs(this.handleError(error));
            }
        }

        return addFacerecPeopleResponse;
    }

    /**
     * Deletes a face recognition person profile.
     *
     * @param person_id Person identifier to remove.
     * @returns Base typed response indicating whether the person was removed.
     * @remarks Endpoint: `POST /facerec_remove_person`
     */
    public async removeFacerecPerson(person_id: string): Promise<EOIBaseOutputs> {
        let removeFacerecPersonResponse = new EOIBaseOutputs(EOIValidator.validateRemoveFacerecPersonInputs(person_id));

        if (removeFacerecPersonResponse.success) {
            const logPrefix = `${this.constructor.name}.removeFacerecPerson`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecRemovePersonPath}`;

            const body: any = { person_id: person_id };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                removeFacerecPersonResponse = new EOIBaseOutputs(response);
            } catch (error) {
                removeFacerecPersonResponse = new EOIBaseOutputs(this.handleError(error));
            }
        }

        return removeFacerecPersonResponse;
    }

    /**
     * Searches face recognition group names by text.
     *
     * @param search Search text used to match group names.
     * @returns A typed response containing matching group names.
     * @remarks Endpoint: `POST /facerec_search_group_names`
     */
    public async searchFacerecGroupNames(search: string): Promise<EOISearchFacerecNamesResponse> {
        let searchFacerecGroupNameResponse = new EOISearchFacerecNamesResponse(EOIValidator.validateFacerecGroupNameSearch(search));

        if (searchFacerecGroupNameResponse.success) {
            const logPrefix = `${this.constructor.name}.searchFacerecGroupNames`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecSearchGroupNamesPath}`;

            const body: any = { search_text: search };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                searchFacerecGroupNameResponse = new EOISearchFacerecNamesResponse(response);
            } catch (error) {
                searchFacerecGroupNameResponse = new EOISearchFacerecNamesResponse(this.handleError(error));
            }
        }

        return searchFacerecGroupNameResponse;
    }

    /**
     * Searches face recognition person names by text.
     *
     * @param search Search text used to match person names.
     * @returns A typed response containing matching person names.
     * @remarks Endpoint: `POST /facerec_search_people_names`
     */
    public async searchFacerecPeopleNames(search: string): Promise<EOISearchFacerecNamesResponse> {
        let searchFacerecPeopleNameResponse = new EOISearchFacerecNamesResponse(EOIValidator.validateFacerecPeopleNameSearch(search));

        if (searchFacerecPeopleNameResponse.success) {
            const logPrefix = `${this.constructor.name}.searchFacerecPeopleNames`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecSearchPeopleNamesPath}`;

            const body: any = { search_text: search };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                searchFacerecPeopleNameResponse = new EOISearchFacerecNamesResponse(response);
            } catch (error) {
                searchFacerecPeopleNameResponse = new EOISearchFacerecNamesResponse(this.handleError(error));
            }
        }

        return searchFacerecPeopleNameResponse;
    }

    /**
     * Returns details for one face recognition person profile.
     *
     * @param person_id Person identifier to query.
     * @returns A typed response containing person profile details.
     * @remarks Endpoint: `POST /facerec_person_details`
     */
    public async getFacerecPersonDetails(person_id: string): Promise<EOIFacerecPersonDetailsResponse> {
        let facerecPersonDetailsResponse = new EOIFacerecPersonDetailsResponse(EOIValidator.validateFacerecPersonDetailsInputs(person_id));

        if (facerecPersonDetailsResponse.success) {
            const logPrefix = `${this.constructor.name}.getFacerecPersonDetails`;
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.facerecPersonDetails}`;

            const body: any = { person_id: person_id };
            this.logger.debug(`${logPrefix}: calling ${endPoint}. body = ${JSON.stringify(body)}`);

            try {
                const response = await this.doPost(endPoint, body, logPrefix);
                facerecPersonDetailsResponse = new EOIFacerecPersonDetailsResponse(response);
            } catch (error) {
                facerecPersonDetailsResponse = new EOIFacerecPersonDetailsResponse(this.handleError(error));
            }
        }

        return facerecPersonDetailsResponse;
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
