import { EOIAddStreamInputs } from "./inputs/eoiAddStreamInputs";
import { EOINotification } from "./elements/eoiNotification";
import { EOIBaseInputs } from "./inputs/eoiBaseInputs";
import { EOIProcessImageInputs } from "./inputs/eoiProcessImageInputs";
import { EOIMonitorStreamInputs } from "./inputs/eoiMonitorStreamInputs";
import { EOIResponse } from "./eoiResponse";
import { EOIRegion } from "./elements/eoiRegion";
import { EOIBoundingBox } from "./elements/eoiBoundingBox";
import { EOIGetLastDetectionInfoInputs } from "./inputs/eoiGetLastDetectionInfoInputs";
import { EOIPreviewFrameInputs } from "./inputs/eoiGetPreviewFrameInputs";
import { EOIProcessVideoInputs } from "./inputs/eoiProcessVideoInputs";
import { EOIRemoveStreamInputs } from "./inputs/eoiRemoveStreamInputs";
import { EOIVideoFrameInputs as EOIGetVideoFrameInputs } from "./inputs/eoiGetVideoFrameInputs";
import { EOIStopMonitoringStreamInputs } from "./inputs/eoiStopMonitoringStreamInputs";
import { EOIObjectDescription } from "./elements/eoiObjectDescription";
import { EOIVertex } from "./elements/eoiVertex";
import { EOIMotionDetection } from "./elements/eoiMotionDetection";
import { EOIDetectionConfig } from "./elements/eoiDetectionConfig";
import { EOILine } from "./elements/eoiLine";
import { EOIDetectionCondition } from "./elements/eoiDetectionCondition";
import { EOIArchiveSearchInputs } from "./inputs/eoiArchiveSearchInputs";
import { EOILiveSearchInputs } from "./inputs/eoiLiveSearchInputs";
import { EOIUpdateLiveSearchInputs } from "./inputs/eoiUpdateLiveSearchInputs";
import { EOIAddFacerecGroupInputs } from "./inputs/eoiAddFacerecGroupInputs";
import { EOIAddFacerecPersonInputs } from "./inputs/eoiAddFacerecPersonInputs";
import { EOIAddFacerecPeopleInputs } from "./inputs/eoiAddFacerecPeopleInputs";
import { EOIFaceRecognitionConfig } from "./elements/eoiFaceRecognitionConfig";
import { EOISimilarityConfig } from "./elements/eoiSimilarityConfig";

export class EOIValidator {
    private static MAX_PHONE_NUMBER_LENGTH = 20;
    private static MIN_PROMPT_LENGTH = 1;
    private static MIN_CONFIDENCE_THRESHOLD = 1;
    private static MAX_CONFIDENCE_THRESHOLD = 99;
    private static MIN_FRAME_RATE = 1;
    private static MIN_STREAM_NAME_LENGTH = 3;
    private static MIN_REGION_NAME_LENGTH = 3;
    private static MIN_LINE_NAME_LENGTH = 3;
    private static MIN_MOTION_THRESHOLD = 10;
    private static MIN_SEARCH_TEXT_LENGTH = 2;
    private static MIN_SEED_ID_LENGTH = 10;
    private static MIN_IMAGE_LENGTH = 100;
    private static VALID_CLASS_NAMES = ["person", "vehicle", "bag", "animal", "unknown"];
    private static VALID_DETECTION_TYPE_NAMES = ["class_name", "natural_language", "face_recognition", "similarity"];
    private static VALID_FACE_REC_MATCH_TYPE_NAMES = ["person", "group"];
    private static MIN_OBJECT_SIZE = 100;
    private static MIN_ALERT_SECONDS = 0.1;
    private static MIN_RESET_SECONDS = 0.1;
    private static MIN_LINE_VERTEX_COUNT = 2;
    private static COUNT_CONDITION_TYPES = ["count_equals", "count_greater_than", "count_less_than"];
    private static LINE_CROSS_CONDITION_TYPES = ["line_cross"];
    private static MIN_SEARCH_DATE_ISO = "2020-01-01T00:00:00Z";
    private static MIN_SEARCH_DATE = new Date(EOIValidator.MIN_SEARCH_DATE_ISO);
    private static MIN_FACEREC_GROUP_NAME_LENGTH = 2;
    private static MIN_FACEREC_PERSON_NAME_LENGTH = 2;
    private static MIN_FACEREC_GROUP_ID_LENGTH = 2;
    private static MIN_FACEREC_PERSON_ID_LENGTH = 2;
    private static MIN_FACEREC_GROUP_DESCRIPTION_LENGTH = 10;

    private static validateBaseInputs(inputs: EOIBaseInputs, lines: EOILine[] | undefined, validateForVideo: boolean): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            response = this.validateRegions(inputs.regions, lines, validateForVideo);
        }

        return response;
    }

    public static validateProcessImageInputs(inputs: EOIProcessImageInputs): EOIResponse {
        return this.validateBaseInputs(inputs, undefined, false);
    }

    public static validateAddStreamInputs(inputs: EOIAddStreamInputs): EOIResponse {
        let response: EOIResponse = this.validateBaseInputs(inputs, inputs.lines, true);

        if (response.success) {
            response = this.validateStreamUrl(inputs.stream_url);
        }

        if (response.success) {
            response = this.validateLines(inputs.lines);
        }

        if (response.success) {
            response = this.validateNotification(inputs.notification);
        }

        if (response.success) {
            const nameTrimmed = inputs.name == null ? null : inputs.name.trim();

            if (nameTrimmed == null || nameTrimmed.length < EOIValidator.MIN_STREAM_NAME_LENGTH) {
                response = new EOIResponse(false, `the stream name must be specified. stream name = ${nameTrimmed}`);
            }
        }

        if (response.success && inputs.frame_rate < EOIValidator.MIN_FRAME_RATE) {
            response = new EOIResponse(false, `the minimum frame rate is ${EOIValidator.MIN_FRAME_RATE}. frame rate = ${inputs.frame_rate}`);
        }

        return response;
    }

    public static validateMonitorStreamInputs(inputs: EOIMonitorStreamInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            response = this.validateStreamUrl(inputs.streamUrl);
        }

        if (response.success) {
            response = this.validateMonitorDuration(inputs.durationSeconds);
        }

        return response;
    }

    public static validateProcessVideoInputs(inputs: EOIProcessVideoInputs): EOIResponse {
        let response: EOIResponse = this.validateBaseInputs(inputs, inputs.lines, true);

        if (response.success) {
            response = this.validateLines(inputs.lines);
        }

        if (response.success) {
            const nameTrimmed = inputs.name == null ? null : inputs.name.trim();

            if (nameTrimmed == null || nameTrimmed.length < EOIValidator.MIN_STREAM_NAME_LENGTH) {
                response = new EOIResponse(false, `the video name must be specified. video name = ${nameTrimmed}`);
            }
        }

        if (response.success) {
            const startTimeTrimmed = inputs.video_start_local_time == null ? null : inputs.video_start_local_time.trim();

            if (startTimeTrimmed == null || startTimeTrimmed.length === 0) {
                response = new EOIResponse(false, `video_start_local_time must be provided. video_start_local_time = ${startTimeTrimmed}`);
            }
            else if (isNaN(Date.parse(startTimeTrimmed))) {
                response = new EOIResponse(false, `video_start_local_time must be a valid time. video_start_local_time = ${startTimeTrimmed}`);
            }
        }

        // TODO: fill this in
        if (response.success && inputs.frame_rate < EOIValidator.MIN_FRAME_RATE) {
            response = new EOIResponse(false, `the minimum frame rate is ${EOIValidator.MIN_FRAME_RATE}. frame rate = ${inputs.frame_rate}`);
        }

        return response;
    }

    public static validateGetPreviewFrameInputs(inputs: EOIPreviewFrameInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            response = this.validateStreamUrl(inputs.streamUrl);
        }

        return response;
    }

    public static validateGetVideoFrameInputs(inputs: EOIGetVideoFrameInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            response = this.validateStreamUrl(inputs.streamUrl);
        }

        return response;
    }

    public static validateGetLastDetectionInfoInputs(inputs: EOIGetLastDetectionInfoInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            response = this.validateStreamUrl(inputs.streamUrl);
        }

        return response;
    }

    public static validateRemoveStreamInputs(inputs: EOIRemoveStreamInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            response = this.validateStreamUrl(inputs.streamUrl);
        }

        return response;
    }

    public static validateStopMonitoringStreamInputs(inputs: EOIStopMonitoringStreamInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            response = this.validateStreamUrl(inputs.streamUrl);
        }

        return response;
    }

    public static validateArchiveSearchInputs(inputs: EOIArchiveSearchInputs): EOIResponse {
        let response: EOIResponse = EOIValidator.validateSearchInputs(inputs);

        if (response.success) {
            const trimmedObjectDescription = inputs.object_description == null ? null : inputs.object_description.trim();
            const trimmedPersonId = inputs.face_person_id == null ? null : inputs.face_person_id.trim();
            const trimmedGroupId = inputs.face_group_id == null ? null : inputs.face_group_id.trim();
            const trimmedSeedId = inputs.seed_id == null ? null : inputs.seed_id.trim();

            const objDescValid = trimmedObjectDescription != null && trimmedObjectDescription.length >= EOIValidator.MIN_SEARCH_TEXT_LENGTH;
            const personIdValid = trimmedPersonId != null && trimmedPersonId.length >= EOIValidator.MIN_SEARCH_TEXT_LENGTH;
            const groupIdValid = trimmedGroupId != null && trimmedGroupId.length >= EOIValidator.MIN_SEARCH_TEXT_LENGTH;
            const seedIdValid = trimmedSeedId != null && trimmedSeedId.length >= EOIValidator.MIN_SEED_ID_LENGTH;
            const imageValid = inputs.image != null && inputs.image.length >= EOIValidator.MIN_IMAGE_LENGTH;

            if (!objDescValid && !personIdValid && !groupIdValid && !seedIdValid && !imageValid) {
                response = new EOIResponse(false, `Search must include one of the following: object description, person, group, seed image id or image`);
            }
        }

        if (response.success) {
            response = this.validateSearchDateRange(inputs.start_date_time, inputs.end_date_time);
        }

        return response;
    }

    public static validateSearchInputs(inputs: EOIArchiveSearchInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Search request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            const trimmedObjectDescription = inputs.object_description == null ? null : inputs.object_description.trim();
            const trimmedPersonId = inputs.face_person_id == null ? null : inputs.face_person_id.trim();
            const trimmedGroupId = inputs.face_group_id == null ? null : inputs.face_group_id.trim();
            const trimmedSeedId = inputs.seed_id == null ? null : inputs.seed_id.trim();

            const objDescValid = trimmedObjectDescription != null && trimmedObjectDescription.length >= EOIValidator.MIN_SEARCH_TEXT_LENGTH;
            const personIdValid = trimmedPersonId != null && trimmedPersonId.length >= EOIValidator.MIN_SEARCH_TEXT_LENGTH;
            const groupIdValid = trimmedGroupId != null && trimmedGroupId.length >= EOIValidator.MIN_SEARCH_TEXT_LENGTH;
            const seedIdValid = trimmedSeedId != null && trimmedSeedId.length >= EOIValidator.MIN_SEED_ID_LENGTH;
            const imageValid = inputs.image != null && inputs.image.length >= EOIValidator.MIN_IMAGE_LENGTH;

            if (!objDescValid && !personIdValid && !groupIdValid && !seedIdValid && !imageValid) {
                response = new EOIResponse(false, `Search must include one of the following: object description, person, group, seed image id or image`);
            }
        }

        return response;
    }

    private static validateSearchDateRange(start_date_time?: string | null, end_date_time?: string | null): EOIResponse {
        const startDateText = start_date_time == null ? null : start_date_time.trim();
        const endDateText = end_date_time == null ? null : end_date_time.trim();

        const startProvided = startDateText != null && startDateText.length > 0;
        const endProvided = endDateText != null && endDateText.length > 0;

        let startDate: Date | null = null;
        let endDate: Date | null = null;

        if (startProvided) {
            startDate = new Date(startDateText as string);

            if (isNaN(startDate.getTime())) {
                return new EOIResponse(false, `start_date_time must be a valid date time string. start_date_time = ${startDateText}`);
            }

            if (startDate.getTime() < EOIValidator.MIN_SEARCH_DATE.getTime()) {
                return new EOIResponse(false, `start_date_time must be on or after ${EOIValidator.MIN_SEARCH_DATE_ISO}. start_date_time = ${startDateText}`);
            }
        }

        if (endProvided) {
            endDate = new Date(endDateText as string);

            if (isNaN(endDate.getTime())) {
                return new EOIResponse(false, `end_date_time must be a valid date time string. end_date_time = ${endDateText}`);
            }

            if (endDate.getTime() < EOIValidator.MIN_SEARCH_DATE.getTime()) {
                return new EOIResponse(false, `end_date_time must be on or after ${EOIValidator.MIN_SEARCH_DATE_ISO}. end_date_time = ${endDateText}`);
            }
        }

        if (startDate != null && endDate != null && startDate.getTime() >= endDate.getTime()) {
            return new EOIResponse(false, `start_date_time must be before end_date_time. start_date_time = ${startDateText}; end_date_time = ${endDateText}`);
        }

        return EOIResponse.success();
    }

    public static validateLiveSearchInputs(inputs: EOILiveSearchInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            if (inputs.search_type == null || !EOIValidator.VALID_DETECTION_TYPE_NAMES.includes(inputs.search_type.trim())) {
                response = new EOIResponse(false, `In search configuration, search type is not valid. Search type is ${inputs.search_type}`);
            }
            else if (inputs.search_type.trim() == "natural_lanuage") {
                if (inputs.class_name != null && !EOIValidator.VALID_CLASS_NAMES.includes(inputs.class_name.trim())) {
                    response = new EOIResponse(false, `In search configurations, class name is not valid. Class name is ${inputs.class_name}`);
                }
                else {
                    const trimmedText = inputs.object_description == null ? null : inputs.object_description.trim();

                    if (trimmedText == null || trimmedText.length < EOIValidator.MIN_SEARCH_TEXT_LENGTH) {
                        response = new EOIResponse(false, `Live search text must be at least ${EOIValidator.MIN_SEARCH_TEXT_LENGTH} character(s). Search text = ${trimmedText}`);
                    }
                }
            }
            else if (inputs.search_type.trim() == "face_recognition") {
                response = this.validateFaceRecognitionConfig(inputs.face_match_type, inputs.face_person_id, inputs.face_group_id);
            }
            else if (inputs.search_type.trim() == "similarity") {
                response = this.validateSimilarityConfig(inputs.image, inputs.alert_threshold);
            }
        }

        if (response.success) {
            if (inputs.seed_id && inputs.seed_id.length < 10) {
                response = new EOIResponse(false, "Please provide a valid similarity search seed ID");
            }
        }

        if (response.success) {
            if (inputs.image && inputs.image.length < EOIValidator.MIN_IMAGE_LENGTH) {
                response = new EOIResponse(false, `Please provide a valid base64 image string`);
            }
        }

        if (response.success) {
            response = inputs.alert_threshold > 0 && inputs.alert_threshold < 100 ?
                EOIResponse.success()
                : new EOIResponse(false, `live search threshold must be greater than 0 and less than 100. Value is ${inputs.alert_threshold}`);
        }

        if (response.success) {
            response = inputs.duration_seconds == null || inputs.duration_seconds >= 0 ?
                EOIResponse.success()
                : new EOIResponse(false, `live search duration must be greater than 0. Value is ${inputs.duration_seconds}`);
        }

        if (response.success) {
            response = this.validateNotification(inputs.notification);
        }

        return response;
    }

    public static validateUpdateLiveSearchInputs(inputs: EOIUpdateLiveSearchInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            response = inputs.search_id != null && (inputs.search_id > 0 || inputs.search_id == -1) ?
                EOIResponse.success()
                : new EOIResponse(false, `search ID must be -1 or greater than 0. Value is ${inputs.search_id}`);
        }

        return response;
    }

    public static validateObjectDescriptions(object_descriptions: EOIObjectDescription[], validate_for_video: boolean): EOIResponse {
        let response: EOIResponse = EOIResponse.success();

        // validate each prompt - minimum length, no duplicates, thresholds
        if (object_descriptions != null && object_descriptions.length > 0) {
            let textSet = new Set<string>();

            for (const object_description of object_descriptions) {
                if (response.success) {
                    const trimmedText = object_description.text == null ? null : object_description.text.trim();

                    if (trimmedText == null || trimmedText.length < EOIValidator.MIN_PROMPT_LENGTH) {
                        response = new EOIResponse(false, `object description text must be at least ${EOIValidator.MIN_PROMPT_LENGTH} character(s). object description text = ${trimmedText}`);
                    }
                    else {
                        if (textSet.has(trimmedText)) {
                            response = new EOIResponse(false, `duplicate object description found: ${trimmedText}`);
                        }
                        else {
                            textSet.add(trimmedText);
                        }
                    }

                    if (validate_for_video) {
                        if (!object_description.background_prompt && object_description.alert) {
                            if ((object_description.threshold != undefined && object_description.threshold < EOIValidator.MIN_CONFIDENCE_THRESHOLD) ||
                                (object_description.threshold != undefined && object_description.threshold > EOIValidator.MAX_CONFIDENCE_THRESHOLD)) {
                                response = new EOIResponse(false, `The object description alerting threshold must be between ${EOIValidator.MIN_CONFIDENCE_THRESHOLD} and ${EOIValidator.MAX_CONFIDENCE_THRESHOLD}. The threshold for object description '${object_description.text}' is ${object_description.threshold}`);
                            }
                        }
                    }
                }
            }

        }

        return response;
    }

    public static validateRegions(regions: EOIRegion[], lines: EOILine[] | undefined, validateForVideo: boolean): EOIResponse {
        let response: EOIResponse = regions == null ?
            new EOIResponse(false, `request must include at least one region`)
            : EOIResponse.success();

        if (response.success) {
            if (regions.length == 0) {
                response = new EOIResponse(false, `request must include at least one region`);
            }

            regions.forEach((region: EOIRegion) => {
                if (response.success) {
                    response = this.validatePolygon(region.polygon);
                }

                if (response.success) {
                    response = this.validateDetectionConfigs(region.detection_configs, lines, validateForVideo);
                }

                let name = region.name == null ? "" : region.name.trim();

                if (name.length < EOIValidator.MIN_REGION_NAME_LENGTH) {
                    response = new EOIResponse(false, `Region name must be at least ${EOIValidator.MIN_REGION_NAME_LENGTH} characters long. Region name is ${region.name}`);
                }

                if (validateForVideo) {
                    if (response.success && region.motion_detection != null) {
                        response = this.validateMotionDetection(region.motion_detection);
                    }
                }
            });
        }

        return response;
    }

    public static validateDetectionConfigs(detection_configs: EOIDetectionConfig[], lines: EOILine[] | undefined, validateForVideo: boolean): EOIResponse {
        let response: EOIResponse = EOIResponse.success();

        if (response.success && detection_configs != null && detection_configs.length > 0) {
            for (var detection_config of detection_configs) {
                if (response.success) {
                    // if (detection_config.object_size == null) {
                    //     response = new EOIResponse(false, `In detection configurations, object size must be specified`);
                    // } else 
                    if (detection_config.class_name != null && detection_config.class_threshold == null) {
                        response = new EOIResponse(false, `In detection configurations, if a class name is specified, a class threshold must also be specified.`);
                    }
                    else if (detection_config.object_size != null && detection_config.object_size < EOIValidator.MIN_OBJECT_SIZE) {
                        response = new EOIResponse(false, `In detection configurations, the object size should be at least ${EOIValidator.MIN_OBJECT_SIZE}. object_size = ${detection_config.object_size}`);
                    }
                    else if (detection_config.detection_type == null || !EOIValidator.VALID_DETECTION_TYPE_NAMES.includes(detection_config.detection_type.trim())) {
                        response = new EOIResponse(false, `In detection configurations, detection type is not valid. Detection type is ${detection_config.detection_type}`);
                    }
                    else if (detection_config.detection_type.trim() == "natural_lanuage") {
                        if (detection_config.class_name != null && !EOIValidator.VALID_CLASS_NAMES.includes(detection_config.class_name.trim())) {
                            response = new EOIResponse(false, `In detection configurations, class name is not valid. Class name is ${detection_config.class_name}`);
                        }
                        else {
                            response = this.validateObjectDescriptions(detection_config.object_descriptions, validateForVideo);
                        }
                    }
                    else if (detection_config.detection_type.trim() == "face_recognition") {
                        if (!detection_config.face_recognition) {
                            response = new EOIResponse(false, `In detection configurations, detection_type is face_recognition, but face recognition options are not provided.`);
                        }
                        else {
                            response = this.validateFaceRecognitionConfig(detection_config.face_recognition.match_type, detection_config.face_recognition.person, detection_config.face_recognition.group);
                        }
                    }
                    else if (detection_config.detection_type.trim() == "similarity") {
                        if (!detection_config.similarity) {
                            response = new EOIResponse(false, `similarity config is required when the detection_type / search_type is similarity`);
                        }
                        else {
                            response = this.validateSimilarityConfig(detection_config.similarity.image, detection_config.similarity.match_threshold);
                        }
                    }

                    if (response.success && validateForVideo) {
                        if (detection_config.alert_seconds != null && detection_config.alert_seconds < EOIValidator.MIN_ALERT_SECONDS) {
                            response = new EOIResponse(false, `In detection configurations, alert seconds must be at least ${EOIValidator.MIN_ALERT_SECONDS}. alert_seconds = ${detection_config.alert_seconds}`);
                        }
                        else if (detection_config.reset_seconds != null && detection_config.reset_seconds < EOIValidator.MIN_RESET_SECONDS) {
                            response = new EOIResponse(false, `In detection configurations, reset seconds must be at least ${EOIValidator.MIN_RESET_SECONDS}. reset_seconds = ${detection_config.reset_seconds}`);
                        }
                        else {
                            if (response.success) {
                                response = this.validateConditions(detection_config.conditions, lines);
                            }
                        }
                    }
                }
            }
        }

        return response;
    }

    public static validateConditions(detectionConditions?: EOIDetectionCondition[], lines?: EOILine[]): EOIResponse {
        let response = EOIResponse.success();

        if (detectionConditions != null && detectionConditions.length > 0) {
            var countConditionTextSet = new Set<string>();

            for (var detectionCondition of detectionConditions) {
                if (response.success) {
                    var trimmedText = detectionCondition.type?.trim().toLowerCase();

                    if (EOIValidator.COUNT_CONDITION_TYPES.includes(trimmedText)) {
                        if (countConditionTextSet.has(trimmedText)) {
                            response = new EOIResponse(false, `Duplicate detection condition found: ${trimmedText}`);
                        }
                        else {
                            countConditionTextSet.add(trimmedText);
                        }

                        if (response.success) {
                            if (detectionCondition.count != null && detectionCondition.count < 0) {
                                response = new EOIResponse(false, `The detection condition count must be at least 0`);
                            }
                        }
                    }
                    else if (EOIValidator.LINE_CROSS_CONDITION_TYPES.includes(trimmedText)) {
                        var lineNameSet = new Set<string>();

                        if (lines != null) {
                            for (var line of lines) {
                                lineNameSet.add(line.name);
                            }
                        }

                        if (detectionCondition.line_name == null || !lineNameSet.has(detectionCondition.line_name)) {
                            response = new EOIResponse(false, `The line_name for line_cross conditions must mach a line name defined in the lines array. The line name ${detectionCondition.line_name} does not match any line names.`);
                        }
                    }
                }
            }
        }

        return response;
    }

    public static validateLines(lines?: EOILine[]): EOIResponse {
        let response = EOIResponse.success();

        if (lines != null && lines.length > 0) {
            var lineNameTextSet = new Set<string>();

            for (var line of lines) {
                if (response.success) {
                    var trimmedText = line.name?.trim().toLowerCase();

                    if (trimmedText == null || trimmedText.length < EOIValidator.MIN_LINE_NAME_LENGTH) {
                        response = new EOIResponse(false, `Line names must be at least ${EOIValidator.MIN_LINE_NAME_LENGTH} characters. The line name ${trimmedText} is not valid.`);
                    }
                    else if (lineNameTextSet.has(trimmedText)) {
                        response = new EOIResponse(false, `Duplicate line name found: ${trimmedText}`);
                    }
                    else {
                        lineNameTextSet.add(trimmedText);
                    }

                    if (response.success) {
                        if (line.vertices == null || line.vertices.length < EOIValidator.MIN_LINE_VERTEX_COUNT) {
                            response = new EOIResponse(false, `Each line must have at least ${EOIValidator.MIN_LINE_VERTEX_COUNT} vertices. The line with name ${line.name} has ${line.vertices.length} vertices.`);
                        }

                        if (response.success) {
                            response = this.validateVertexArray(line.vertices);
                        }
                    }
                }
            }
        }

        return response;
    }

    public static validatePolygon(polygon: EOIVertex[]): EOIResponse {
        let response: EOIResponse = polygon == null ?
            new EOIResponse(false, `region must include a polygon`)
            : EOIResponse.success();

        if (response.success) {
            if (polygon.length < 3) {
                response = new EOIResponse(false, `Polygon must contain at least 3 vertices`);
            }
            else {
                response = this.validateVertexArray(polygon);
            }
        }

        return response;
    }

    public static validateVertexArray(vertices: EOIVertex[]): EOIResponse {
        let response: EOIResponse = EOIResponse.success();

        for (var vertex of vertices) {
            if (response.success) {
                if (vertex.x < 0 || vertex.y < 0) {
                    response = new EOIResponse(false, `The vertex x and y values cannot be negative`);
                    break;
                }
            }
        }

        return response;
    }

    public static validateNotification(notification: EOINotification | undefined): EOIResponse {
        let response: EOIResponse = EOIResponse.success();

        if (notification != null) {
            if (notification.phone_number) {
                response = this.validatePhoneNumber(notification.phone_number);
            }
        }

        return response;
    }

    public static validateMotionDetection(motionDetection: EOIMotionDetection): EOIResponse {
        let response: EOIResponse = motionDetection == null ?
            new EOIResponse(false, `request must include motion_detection configurtion`)
            : EOIResponse.success();

        if (response.success) {
            if (motionDetection.detection_threshold < EOIValidator.MIN_MOTION_THRESHOLD) {
                response = new EOIResponse(false, `motion detection threshold should be at least ${EOIValidator.MIN_MOTION_THRESHOLD}. DetectionThreshold = ${motionDetection.detection_threshold}`);
            }
            else if (motionDetection.regular_check_frame_interval < 1) {
                response = new EOIResponse(false, `motion detection regular check interval should be at least 1. regular_check_frame_interval = ${motionDetection.regular_check_frame_interval}`);
            }
            else if (motionDetection.backup_check_frame_interval != null && motionDetection.backup_check_frame_interval < 1) {
                response = new EOIResponse(false, `motion detection backup check interval should be at least 1. backup_check_frame_interval = ${motionDetection.backup_check_frame_interval}`);
            }
        }

        return response;
    }

    public static validateBoundingBox(boundingBox: EOIBoundingBox): EOIResponse {
        let response: EOIResponse = boundingBox == null ?
            new EOIResponse(false, `request must include bounding_box configurtion`)
            : EOIResponse.success();

        if (response.success) {
            // add field validation
        }

        return response;
    }

    public static validateStreamUrl(stream_url: string): EOIResponse {
        const trimmedUrl = stream_url == null ? null : stream_url.trim();

        return trimmedUrl != null && trimmedUrl.length > 0 ?
            EOIResponse.success()
            : new EOIResponse(false, "The stream url must be a valid RTSP URL");
    }

    public static validatePhoneNumber(phone_number: string | null): EOIResponse {
        const trimmedPhoneNumber = phone_number == null ? null : phone_number.trim();

        let response: EOIResponse = trimmedPhoneNumber == null || trimmedPhoneNumber.length == 0 ?
            new EOIResponse(false, "The phone number cannot be null or empty")
            : EOIResponse.success();

        if (response.success && trimmedPhoneNumber != null) {
            if (trimmedPhoneNumber.length > EOIValidator.MAX_PHONE_NUMBER_LENGTH) {
                response = new EOIResponse(false, `The phone number maximum length is ${EOIValidator.MAX_PHONE_NUMBER_LENGTH}`);
            }
            else if (!trimmedPhoneNumber.startsWith("+")) {
                response = new EOIResponse(false, `The phone number must start with a country code like +1`);
            }
            else {
                response = EOIResponse.success();
            }
        }

        return response;
    }

    public static validateMonitorDuration(durationSeconds: number | null): EOIResponse {
        return durationSeconds == null || durationSeconds >= 0 ?
            EOIResponse.success()
            : new EOIResponse(false, `stream monitor duration must be greater than 0. Value is ${durationSeconds}`);
    }

    public static validateFacerecGroupNameSearch(search: string): EOIResponse {
        const trimmedSearch = search == null ? null : search.trim();

        return trimmedSearch != null && trimmedSearch.length > 0 ?
            EOIResponse.success()
            : new EOIResponse(false, `The group name search string '${trimmedSearch}' must be at least 1 character`);
    }

    public static validateFacerecPeopleNameSearch(search: string): EOIResponse {
        const trimmedSearch = search == null ? null : search.trim();

        return trimmedSearch != null && trimmedSearch.length > 0 ?
            EOIResponse.success()
            : new EOIResponse(false, `The person name search string '${trimmedSearch}' must be at least 1 character`);
    }

    public static validateRemoveFacerecGroupInputs(group_id: string): EOIResponse {
        const trimmedGroupId = group_id == null ? null : group_id.trim();

        return trimmedGroupId != null && trimmedGroupId.length > 0 ?
            EOIResponse.success()
            : new EOIResponse(false, `The group ID '${trimmedGroupId}' must be at least ${EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH} character${EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH > 1 ? "s" : ""}`);
    }

    public static validateNewFacerecGroup(inputs: EOIAddFacerecGroupInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, `inputs must be provided`)
            : EOIResponse.success();

        if (response.success) {
            const trimmedGroupId = inputs.group_id == null ? null : inputs.group_id.trim();

            if (trimmedGroupId == null || trimmedGroupId.length < EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH) {
                response = new EOIResponse(false, `The group ID '${trimmedGroupId}' must be at least ${EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH} character${EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH > 1 ? "s" : ""}`);
            }
        }

        if (response.success) {
            const trimmedGroupName = inputs.group_name == null ? null : inputs.group_name.trim();

            if (trimmedGroupName == null || trimmedGroupName.length < EOIValidator.MIN_FACEREC_GROUP_NAME_LENGTH) {
                response = new EOIResponse(false, `The group name '${trimmedGroupName}' must be at least ${EOIValidator.MIN_FACEREC_GROUP_NAME_LENGTH} character${EOIValidator.MIN_FACEREC_GROUP_NAME_LENGTH > 1 ? "s" : ""}`);
            }
        }

        if (response.success) {
            const trimmedGroupDesc = inputs.group_description == null ? null : inputs.group_description.trim();

            if (trimmedGroupDesc == null || trimmedGroupDesc.length < EOIValidator.MIN_FACEREC_GROUP_DESCRIPTION_LENGTH) {
                response = new EOIResponse(false, `The group description '${trimmedGroupDesc}' must be at least ${EOIValidator.MIN_FACEREC_GROUP_DESCRIPTION_LENGTH} character${EOIValidator.MIN_FACEREC_GROUP_DESCRIPTION_LENGTH > 1 ? "s" : ""}`);
            }
        }

        return response;
    }

    public static validateNewFacerecPerson(inputs: EOIAddFacerecPersonInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, `inputs must be provided`)
            : EOIResponse.success();

        if (response.success) {
            const trimmedPersonId = inputs.person_id == null ? null : inputs.person_id.trim();

            if (trimmedPersonId == null || trimmedPersonId.length < EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH) {
                response = new EOIResponse(false, `The person id '${trimmedPersonId}' must be at least ${EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH} character${EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH > 1 ? "s" : ""}`);
            }
        }

        if (response.success) {
            const trimmedPersonName = inputs.person_display_name == null ? null : inputs.person_display_name.trim();

            if (trimmedPersonName == null || trimmedPersonName.length < EOIValidator.MIN_FACEREC_PERSON_NAME_LENGTH) {
                response = new EOIResponse(false, `The person name '${trimmedPersonName}' must be at least ${EOIValidator.MIN_FACEREC_PERSON_NAME_LENGTH} character${EOIValidator.MIN_FACEREC_PERSON_NAME_LENGTH > 1 ? "s" : ""}`);
            }
        }

        if (response.success) {
            if (inputs.person_groups != null && inputs.person_groups.length > 0) {
                for (const group_id of inputs.person_groups) {
                    if (response.success) {
                        const trimmedGroupId = group_id.trim();

                        if (trimmedGroupId == null || trimmedGroupId.length < EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH) {
                            response = new EOIResponse(false, `The group ID '${trimmedGroupId}' must be at least ${EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH} character${EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH > 1 ? "s" : ""}`);
                        }
                    }
                }
            }
        }

        if (response.success) {
            var image_count: number = 0;

            if (inputs.person_images != null && inputs.person_images.length > 0) {
                for (const person_image of inputs.person_images) {
                    if (response.success) {
                        if (person_image.image && person_image.image.length < EOIValidator.MIN_IMAGE_LENGTH) {
                            response = new EOIResponse(false, `Please provide a valid base64 image string`);
                        }
                        else if (person_image.file_path && person_image.file_path.length < 5) {
                            response = new EOIResponse(false, `Please provide a valid file path`);
                        }
                        else {
                            image_count++;
                        }
                    }
                }
            }

            if (image_count == 0) {
                response = new EOIResponse(false, `Please provide at least one image as base64 or as a file path`);
            }
        }

        return response;
    }

    public static validateAddFacerecPeople(inputs: EOIAddFacerecPeopleInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, `inputs must be provided`)
            : EOIResponse.success();

        if (response.success) {
            if (inputs.file_path == null || inputs.file_path.length < 5) {
                response = new EOIResponse(false, `Please provide a valid file path`);
            }
        }

        return response;
    }

    public static validateRemoveFacerecPersonInputs(person_id: string): EOIResponse {
        const trimmedPersonId = person_id == null ? null : person_id.trim();

        return trimmedPersonId != null && trimmedPersonId.length > 0 ?
            EOIResponse.success()
            : new EOIResponse(false, `The person ID '${trimmedPersonId}' must be at least ${EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH} character${EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH > 1 ? "s" : ""}`);
    }

    public static validateFacerecPersonDetailsInputs(person_id: string): EOIResponse {
        const trimmedPersonId = person_id == null ? null : person_id.trim();

        return trimmedPersonId != null && trimmedPersonId.length > 0 ?
            EOIResponse.success()
            : new EOIResponse(false, `The person ID '${trimmedPersonId}' must be at least ${EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH} character${EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH > 1 ? "s" : ""}`);
    }

    public static validateFaceRecognitionConfig(match_type: string, person_id: string | undefined, group_id?: string | undefined): EOIResponse {
        let response: EOIResponse = EOIResponse.success();

        // validate match type
        if (response.success) {
            if (match_type != null) {
                match_type = match_type.trim().toLowerCase();
            }

            if (match_type == null || !EOIValidator.VALID_FACE_REC_MATCH_TYPE_NAMES.includes(match_type)) {
                response = new EOIResponse(false, `Invalid face recognition match type. Value is ${match_type}`);
            }

            // validate person / group match params
            if (response.success) {
                if (match_type == "person") {
                    if (!person_id || person_id.length < EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH) {
                        response = new EOIResponse(false, `Invalid face recognition person id. Value is ${person_id}`);
                    }
                }
                else if (match_type == "group") {
                    if (!group_id || group_id.length < EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH) {
                        response = new EOIResponse(false, `Invalid face recognition group id. Value is ${group_id}`);
                    }
                }
            }
        }

        return response;
    }

    public static validateSimilarityConfig(image: string | undefined, match_threshold: number): EOIResponse {
        let response: EOIResponse = EOIResponse.success();

        // validate match type
        if (response.success) {
            if (image == null || image.length < EOIValidator.MIN_IMAGE_LENGTH) {
                response = new EOIResponse(false, `Invalid similarity image. Please provide a valid base64 image string`);
            }
            else if (match_threshold < EOIValidator.MIN_CONFIDENCE_THRESHOLD || match_threshold > EOIValidator.MAX_CONFIDENCE_THRESHOLD) {
                response = new EOIResponse(false, `Invalid similarity match threshold. Value must be between ${EOIValidator.MIN_CONFIDENCE_THRESHOLD} and ${EOIValidator.MAX_CONFIDENCE_THRESHOLD}. Value is ${match_threshold}`);
            }
        }

        return response;
    }
}