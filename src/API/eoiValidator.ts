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
import { EOISearchInputs } from "./inputs/eoiSearchInputs";
import { EOILiveSearchInputs } from "./inputs/eoiLiveSearchInputs";
import { EOICancelLiveSearchInputs } from "./inputs/eoiCancelLiveSearchInputs";
import { EOISimilaritySearchInputs } from "./inputs/eoiSimilaritySearchInputs";

export class EOIValidator {
    private static MAX_PHONE_NUMBER_LENGTH = 20;
    private static MIN_PROMPT_LENGTH = 1;
    private static MIN_PROMPT_THRESHOLD = 1;
    private static MAX_PROMPT_THRESHOLD = 99;
    private static MIN_FRAME_RATE = 1;
    private static MIN_STREAM_NAME_LENGTH = 3;
    private static MIN_REGION_NAME_LENGTH = 3;
    private static MIN_LINE_NAME_LENGTH = 3;
    private static MIN_MOTION_THRESHOLD = 10;
    private static MIN_SEARCH_TEXT_LENGTH = 2;
    private static VALID_CLASS_NAMES = ["person", "vehicle", "bag", "animal", "unknown"];
    private static MIN_OBJECT_SIZE = 100;
    private static MIN_ALERT_SECONDS = 0.1;
    private static MIN_RESET_SECONDS = 0.1;
    private static MIN_LINE_VERTEX_COUNT = 2;
    private static COUNT_CONDITION_TYPES = ["count_equals", "count_greater_than", "count_less_than"];
    private static LINE_CROSS_CONDITION_TYPES = ["line_cross"];

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

    public static validateSearchInputs(inputs: EOISearchInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Search request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            const trimmedText = inputs.object_description == null ? null : inputs.object_description.trim();

            if (trimmedText == null || trimmedText.length < EOIValidator.MIN_SEARCH_TEXT_LENGTH) {
                response = new EOIResponse(false, `Search text must be at least ${EOIValidator.MIN_SEARCH_TEXT_LENGTH} character(s). Search text = ${trimmedText}`);
            }
        }

        return response;
    }

    public static validateSimilaritySearchInputs(inputs: EOISimilaritySearchInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Similarity search request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            if (!inputs.seed_id) {
                response = new EOIResponse(false, "Similarity search seed ID is required");
            }
        }

        return response;
    }

    public static validateLiveSearchInputs(inputs: EOILiveSearchInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            if (inputs.class_name == null || !EOIValidator.VALID_CLASS_NAMES.includes(inputs.class_name.trim())) {
                response = new EOIResponse(false, `In detection configurations, class name is not valid. Class name is ${inputs.class_name}`);
            }
        }

        if (response.success) {
            const trimmedText = inputs.object_description == null ? null : inputs.object_description.trim();

            if (trimmedText == null || trimmedText.length < EOIValidator.MIN_SEARCH_TEXT_LENGTH) {
                response = new EOIResponse(false, `Live search text must be at least ${EOIValidator.MIN_SEARCH_TEXT_LENGTH} character(s). Search text = ${trimmedText}`);
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

    public static validateCancelLiveSearchInputs(inputs: EOICancelLiveSearchInputs): EOIResponse {
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
                            if ((object_description.threshold != undefined && object_description.threshold < EOIValidator.MIN_PROMPT_THRESHOLD) ||
                                (object_description.threshold != undefined && object_description.threshold > EOIValidator.MAX_PROMPT_THRESHOLD)) {
                                response = new EOIResponse(false, `The object description alerting threshold must be between ${EOIValidator.MIN_PROMPT_THRESHOLD} and ${EOIValidator.MAX_PROMPT_THRESHOLD}. The threshold for object description '${object_description.text}' is ${object_description.threshold}`);
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
                    else if (detection_config.class_name != null && !EOIValidator.VALID_CLASS_NAMES.includes(detection_config.class_name.trim())) {
                        response = new EOIResponse(false, `In detection configurations, class name is not valid. Class name is ${detection_config.class_name}`);
                    }
                    else if (detection_config.object_size != null && detection_config.object_size < EOIValidator.MIN_OBJECT_SIZE) {
                        response = new EOIResponse(false, `In detection configurations, the object size should be at least ${EOIValidator.MIN_OBJECT_SIZE}. object_size = ${detection_config.object_size}`);
                    }
                    else {
                        response = this.validateObjectDescriptions(detection_config.object_descriptions, validateForVideo);
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
}