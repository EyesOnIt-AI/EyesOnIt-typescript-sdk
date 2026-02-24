
import { ExceptionUtil } from '../utils/exceptionUtil';
import { JSONUtil } from '../utils/JSONUtil';
import { Logger } from '../utils/logger';
import { EOIResponse } from "./eoiResponse";
import { EOIAddStreamInputs } from './inputs/eoiAddStreamInputs';
import { EOIUpdateLiveSearchInputs } from './inputs/eoiUpdateLiveSearchInputs';
import { EOIMonitorStreamInputs } from './inputs/eoiMonitorStreamInputs';
import { EOIProcessImageInputs } from './inputs/eoiProcessImageInputs';
import { EOIProcessVideoInputs } from './inputs/eoiProcessVideoInputs';
import { EOIArchiveSearchInputs } from './inputs/eoiArchiveSearchInputs';
import { EOILiveSearchInputs } from './inputs/eoiLiveSearchInputs';
import { EOIValidator } from './eoiValidator';
import { EOIAddStreamResponse } from './outputs/eoiAddStreamResponse';
import { EOIGetAllStreamsInfoResponse } from './outputs/eoiGetAllStreamsInfoResponse';
import { EOIGetLastDetectionInfoResponse } from './outputs/eoiGetLastDetectionInfoResponse';
import { EOIGetStreamDetailsResponse } from './outputs/eoiGetStreamDetailsResponse';
import { EOIGetVideoFrameResponse } from './outputs/eoiGetVideoFrameResponse';
import { EOILiveSearchResponse } from './outputs/eoiLiveSearchResponse';
import { EOIMonitorStreamResponse } from './outputs/eoiMonitorStreamResponse';
import { EOIProcessImageResponse } from './outputs/eoiProcessImageResponse';
import { EOIProcessVideosResponse } from './outputs/eoiProcessVideosResponse';
import { EOIRemoveStreamResponse } from './outputs/eoiRemoveStreamResponse';
import { EOISearchResponse } from './outputs/eoiSearchResponse';
import { EOIStopMonitoringStreamResponse } from './outputs/eoiStopMonitoringStreamResponse';
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

/**
 * Client for the EyesOnIt REST API.
 *
 * This class wraps the HTTP endpoints exposed by EyesOnIt and returns typed response
 * objects for each operation.
 */
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
    private static readonly getVideoFramePath = "/get_video_frame";
    private static readonly searchLivePath = "/live_search";
    private static readonly searchArchivePath = "/archive_search";
    private static readonly pauseLiveSearchPath = "/pause_live_search";
    private static readonly resumeLiveSearchPath = "/resume_live_search";
    private static readonly cancelLiveSearchPath = "/cancel_live_search";
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

    /**
     * Submits a video for asynchronous processing with the supplied detection settings.
     *
     * @param inputs Video metadata and detection configuration.
     * @returns A typed response containing processing status details.
     * @remarks Endpoint: `POST /process_videos`
     */
    public async processVideo(inputs: EOIProcessVideoInputs): Promise<EOIProcessVideosResponse> {
        let logPrefix = `${this.constructor.name}.processVideo`;
        let processVideosResponse: EOIProcessVideosResponse = new EOIProcessVideosResponse(EOIValidator.validateProcessVideoInputs(inputs));

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
     * Updates runtime configuration on the EyesOnIt server.
     *
     * @param inputs Arbitrary configuration object accepted by the `/update_config` endpoint.
     * @returns A typed response containing update status details.
     * @remarks Endpoint: `POST /update_config`
     */
    public async updateConfig(inputs: any): Promise<EOIUpdateConfigResponse> {
        let logPrefix = `${this.constructor.name}.updateConfig`;
        let updateConfigResponse: EOIUpdateConfigResponse = new EOIUpdateConfigResponse(EOIResponse.success());

        if (updateConfigResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.updateConfigPath}`;

            const body: any = inputs;

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

