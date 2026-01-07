
import { ExceptionUtil } from '../utils/exceptionUtil';
import { JSONUtil } from '../utils/JSONUtil';
import { Logger } from '../utils/logger';
import { EOIResponse } from "./eoiResponse";
import { EOIAddStreamInputs } from './inputs/eoiAddStreamInputs';
import { EOIUpdateLiveSearchInputs } from './inputs/eoiUpdateLiveSearchInputs';
import { EOILiveSearchInputs } from './inputs/eoiLiveSearchInputs';
import { EOIMonitorStreamInputs } from './inputs/eoiMonitorStreamInputs';
import { EOIProcessImageInputs } from './inputs/eoiProcessImageInputs';
import { EOIProcessVideoInputs } from './inputs/eoiProcessVideoInputs';
import { EOISearchInputs } from './inputs/eoiSearchInputs';
import { EOISimilaritySearchInputs } from './inputs/eoiSimilaritySearchInputs';
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
    private static readonly searchPath = "/search";
    private static readonly similaritySearchPath = "/similarity_search";
    private static readonly liveSearchPath = "/live_search";
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

    public async search(inputs: EOISearchInputs): Promise<EOISearchResponse> {
        let logPrefix = `${this.constructor.name}.search`;
        let searchResponse: EOISearchResponse = new EOISearchResponse(EOIValidator.validateSearchInputs(inputs));

        if (searchResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.searchPath}`;

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

    public async similaritySearch(inputs: EOISimilaritySearchInputs): Promise<EOISearchResponse> {
        let logPrefix = `${this.constructor.name}.similaritySearch`;
        let searchResponse: EOISearchResponse = new EOISearchResponse(EOIValidator.validateSimilaritySearchInputs(inputs));

        if (searchResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.similaritySearchPath}`;

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

    public async liveSearch(inputs: EOILiveSearchInputs): Promise<EOILiveSearchResponse> {
        let logPrefix = `${this.constructor.name}.liveSearch`;
        let liveSearchResponse: EOILiveSearchResponse = new EOILiveSearchResponse(EOIValidator.validateLiveSearchInputs(inputs));

        if (liveSearchResponse.success) {
            let endPoint = `${this.apiBasePath}${EyesOnItAPI.liveSearchPath}`;

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

