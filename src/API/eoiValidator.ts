import { EOIAddStreamInputs } from "./inputs/eoiAddStreamInputs";
import { EOINotification } from "./elements/eoiNotification";
import { EOIBaseInputs } from "./inputs/eoiBaseInputs";
import { EOIProcessImageInputs } from "./inputs/eoiProcessImageInputs";
import { EOIMonitorStreamInputs } from "./inputs/eoiMonitorStreamInputs";
import { EOIResponse } from "./eoiResponse";
import { EOIRegion } from "./elements/eoiRegion";
import { EOIBoundingBox } from "./elements/eoiBoundingBox";
import { EOIProcessVideoInputs } from "./inputs/eoiProcessVideoInputs";
import { EOIObjectDescription } from "./elements/eoiObjectDescription";
import { EOIVertex } from "./elements/eoiVertex";
import { EOIMotionDetection } from "./elements/eoiMotionDetection";
import { EOIDetectionConfig } from "./elements/eoiDetectionConfig";
import { EOILine } from "./elements/eoiLine";
import { EOIDetectionCondition } from "./elements/eoiDetectionCondition";
import { EOIArchiveSearchInputs } from "./inputs/eoiArchiveSearchInputs";
import { EOILiveSearchInputs } from "./inputs/eoiLiveSearchInputs";
import { EOISearchInputs } from "./inputs/eoiSearchInputs";
import { EOIUpdateLiveSearchInputs } from "./inputs/eoiUpdateLiveSearchInputs";
import { EOIAddFacerecGroupInputs } from "./inputs/eoiAddFacerecGroupInputs";
import { EOIAddFacerecPersonInputs } from "./inputs/eoiAddFacerecPersonInputs";
import { EOIAddFacerecPeopleInputs } from "./inputs/eoiAddFacerecPeopleInputs";
import { EOIFaceRecognitionConfig } from "./elements/eoiFaceRecognitionConfig";
import { EOISimilarityConfig } from "./elements/eoiSimilarityConfig";
import { EOISimilarityImage } from "./elements/eoiSimilarityImage";
import { EOIRule } from "./elements/eoiRule";

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
    private static VALID_FACE_REC_MATCH_TYPE_NAMES = ["person", "group", "all_faces"];
    private static MIN_OBJECT_SIZE = 100;
    private static MIN_ALERT_SECONDS = 0.1;
    private static MIN_RESET_SECONDS = 0.1;
    private static MIN_LINE_VERTEX_COUNT = 2;
    private static COUNT_CONDITION_TYPES = ["count_equals", "count_greater_than", "count_less_than"];
    private static LINE_CROSS_CONDITION_TYPES = ["line_cross"];
    private static RULE_ACTION_TYPES = ["alert", "record_event", "record_metric", "record_frame", "record_video", "create_evidence"];
    private static COUNT_RULE_OPERATORS = [">", "gt", "greater", "greater_than", "count_greater_than", "<", "lt", "less", "less_than", "count_less_than", "=", "==", "eq", "equals", "equal", "count_equals"];
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

        if (response.success && inputs.stream_id != null) {
            response = this.validateStreamId(inputs.stream_id);
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
            response = this.validateStreamId(inputs.streamId);
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
            const startTimeProvided = inputs.video_start_local_time != null;
            const startTimeTrimmed = inputs.video_start_local_time == null ? null : inputs.video_start_local_time.trim();

            if (startTimeProvided && (startTimeTrimmed == null || startTimeTrimmed.length === 0)) {
                response = new EOIResponse(false, `video_start_local_time must be a valid time when provided. video_start_local_time = ${startTimeTrimmed}`);
            }
            else if (startTimeTrimmed != null && isNaN(Date.parse(startTimeTrimmed))) {
                response = new EOIResponse(false, `video_start_local_time must be a valid time. video_start_local_time = ${startTimeTrimmed}`);
            }
        }

        // TODO: fill this in
        if (response.success && inputs.frame_rate < EOIValidator.MIN_FRAME_RATE) {
            response = new EOIResponse(false, `the minimum frame rate is ${EOIValidator.MIN_FRAME_RATE}. frame rate = ${inputs.frame_rate}`);
        }

        return response;
    }

    public static validateArchiveSearchInputs(inputs: EOIArchiveSearchInputs): EOIResponse {
        let response: EOIResponse = EOIValidator.validateSearchInputs(inputs);

        if (response.success) {
            response = this.validateSearchDateRange(inputs.start_date_time, inputs.end_date_time);
        }

        return response;
    }

    public static validateSearchInputs(inputs: EOISearchInputs): EOIResponse {
        let response: EOIResponse = inputs == null ?
            new EOIResponse(false, "inputs = null. Search request must include inputs")
            : EOIResponse.success();

        if (response.success) {
            const trimmedObjectDescription = inputs.object_description == null ? null : inputs.object_description.trim();
            const trimmedMatchType = inputs.face_match_type == null ? null : inputs.face_match_type.trim();
            const trimmedPersonId = inputs.face_person_id == null ? null : inputs.face_person_id.trim();
            const trimmedGroupId = inputs.face_group_id == null ? null : inputs.face_group_id.trim();
            const hasFaceRecognitionInputs = (trimmedMatchType != null && trimmedMatchType.length > 0)
                || (trimmedPersonId != null && trimmedPersonId.length > 0)
                || (trimmedGroupId != null && trimmedGroupId.length > 0);
            const hasSimilarityConfig = inputs.similarity != null;

            const objDescValid = trimmedObjectDescription != null && trimmedObjectDescription.length >= EOIValidator.MIN_SEARCH_TEXT_LENGTH;
            let faceRecognitionValid = false;
            let similarityValid = false;

            if (trimmedObjectDescription != null && trimmedObjectDescription.length > 0 && !objDescValid) {
                response = new EOIResponse(false, `In search configuration, object description is not valid. object description is ${inputs.object_description}`);
            }

            if (response.success && hasFaceRecognitionInputs) {
                response = this.validateFaceRecognitionConfig(inputs.face_match_type, inputs.face_person_id, inputs.face_group_id);
                faceRecognitionValid = response.success;
            }

            if (response.success && hasSimilarityConfig) {
                response = this.validateSimilarityConfig(inputs.similarity);
                similarityValid = response.success;
            }

            if (response.success && !objDescValid && !faceRecognitionValid && !similarityValid) {
                response = new EOIResponse(false, "Search must include a valid object description, face recognition configuration, or similarity configuration");
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
        let response: EOIResponse = this.validateSearchInputs(inputs);

        if (response.success) {
            if (inputs.class_name != null && !EOIValidator.VALID_CLASS_NAMES.includes(inputs.class_name.trim())) {
                response = new EOIResponse(false, `In search configuration, class name is not valid. Class name is ${inputs.class_name}`);
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

                if (response.success && validateForVideo) {
                    response = this.validateRules(region.rules, region.detection_configs, lines);
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

    public static validateRules(rules: EOIRule[] | undefined, detectionConfigs: EOIDetectionConfig[], lines?: EOILine[]): EOIResponse {
        let response = EOIResponse.success();

        if (rules == null || rules.length === 0) {
            return response;
        }

        const detectionConfigIds = EOIValidator.getDetectionConfigIds(detectionConfigs);

        for (const rule of rules) {
            if (!response.success) {
                break;
            }

            const condition = rule?.condition;
            const conditionType = condition?.type == null ? "" : String(condition.type).trim().toLowerCase();

            if (condition == null) {
                response = new EOIResponse(false, "Rule condition must be specified");
            }
            else if (conditionType.length === 0) {
                response = new EOIResponse(false, "Rule condition type must be specified");
            }
            else {
                response = this.validateRuleActions(rule);
            }

            if (response.success) {
                response = this.validateRuleTiming(rule);
            }

            if (response.success && conditionType === "count") {
                response = this.validateCountRule(rule, detectionConfigIds);
            }
            else if (response.success && conditionType === "line_cross") {
                response = this.validateLineCrossRule(rule, detectionConfigIds, lines);
            }
            else if (response.success && conditionType.startsWith("interaction.")) {
                response = this.validateInteractionRule(rule, detectionConfigIds);
            }
            else if (response.success) {
                response = new EOIResponse(false, `Unsupported rule condition type: ${conditionType}`);
            }
        }

        return response;
    }

    private static validateRuleActions(rule: EOIRule): EOIResponse {
        const actions = rule.actions ?? [];

        if (actions.length === 0) {
            return new EOIResponse(false, "Rule actions must include at least one action");
        }

        for (const action of actions) {
            const actionType = action?.type == null ? "" : String(action.type).trim().toLowerCase();
            if (!EOIValidator.RULE_ACTION_TYPES.includes(actionType)) {
                return new EOIResponse(false, `Unsupported rule action type: ${actionType}`);
            }
            if (action.pre_roll_seconds != null && action.pre_roll_seconds < 0) {
                return new EOIResponse(false, "Rule action pre_roll_seconds must be zero or greater");
            }
            if (action.post_roll_seconds != null && action.post_roll_seconds < 0) {
                return new EOIResponse(false, "Rule action post_roll_seconds must be zero or greater");
            }
        }

        return EOIResponse.success();
    }

    private static validateRuleTiming(rule: EOIRule): EOIResponse {
        const dwellSeconds = rule.dwell_seconds ?? rule.condition?.dwell_seconds;
        const resetSeconds = rule.reset_seconds ?? rule.condition?.reset_seconds;

        if (dwellSeconds != null && dwellSeconds < EOIValidator.MIN_ALERT_SECONDS) {
            return new EOIResponse(false, `Rule dwell_seconds must be at least ${EOIValidator.MIN_ALERT_SECONDS}. dwell_seconds = ${dwellSeconds}`);
        }
        if (resetSeconds != null && resetSeconds < EOIValidator.MIN_RESET_SECONDS) {
            return new EOIResponse(false, `Rule reset_seconds must be at least ${EOIValidator.MIN_RESET_SECONDS}. reset_seconds = ${resetSeconds}`);
        }

        return EOIResponse.success();
    }

    private static validateCountRule(rule: EOIRule, detectionConfigIds: Set<string>): EOIResponse {
        const configId = rule.condition.detectionConfigId();
        if (!EOIValidator.isKnownDetectionConfigId(configId, detectionConfigIds)) {
            return new EOIResponse(false, `Count rule references unknown detection config: ${configId}`);
        }

        const operator = rule.condition.operator == null ? "greater_than" : String(rule.condition.operator).trim().toLowerCase();
        if (!EOIValidator.COUNT_RULE_OPERATORS.includes(operator)) {
            return new EOIResponse(false, `Unsupported count rule operator: ${operator}`);
        }

        const count = rule.condition.count ?? rule.condition.value;
        if (count == null || count < 0) {
            return new EOIResponse(false, "Count rule condition must include a count of at least 0");
        }

        if (!EOIValidator.ruleHasAction(rule, "alert")) {
            return new EOIResponse(false, "Count rules currently require an alert action");
        }

        return EOIResponse.success();
    }

    private static validateLineCrossRule(rule: EOIRule, detectionConfigIds: Set<string>, lines?: EOILine[]): EOIResponse {
        const configId = rule.condition.detectionConfigId();
        if (!EOIValidator.isKnownDetectionConfigId(configId, detectionConfigIds)) {
            return new EOIResponse(false, `Line-cross rule references unknown detection config: ${configId}`);
        }

        const lineName = rule.condition.line_name == null ? "" : String(rule.condition.line_name);
        if (lineName.length === 0) {
            return new EOIResponse(false, "Line-cross rule condition must include line_name");
        }

        const alertDirection = rule.condition.alert_direction == null ? "" : String(rule.condition.alert_direction).trim().toLowerCase();
        if (!["positive", "negative"].includes(alertDirection)) {
            return new EOIResponse(false, "Line-cross rule condition alert_direction must be positive or negative");
        }

        const lineNameSet = new Set<string>((lines ?? []).map((line) => line.name));
        if (lineNameSet.size > 0 && !lineNameSet.has(lineName)) {
            return new EOIResponse(false, `The line_name for line-cross rules must match a line name defined in the lines array. line_name = ${lineName}`);
        }

        if (!EOIValidator.ruleHasAction(rule, "alert")) {
            return new EOIResponse(false, "Line-cross rules currently require an alert action");
        }

        return EOIResponse.success();
    }

    private static validateInteractionRule(rule: EOIRule, detectionConfigIds: Set<string>): EOIResponse {
        const primaryConfigId = rule.condition.primary_config_id ?? rule.condition.source_config_id ?? rule.condition.detection_config_id;
        if (!EOIValidator.isKnownDetectionConfigId(primaryConfigId, detectionConfigIds)) {
            return new EOIResponse(false, `Interaction rule references unknown primary detection config: ${primaryConfigId}`);
        }

        const secondaryConfigId = rule.condition.secondary_config_id;
        if (secondaryConfigId != null && String(secondaryConfigId).trim().length > 0 && !EOIValidator.isKnownDetectionConfigId(secondaryConfigId, detectionConfigIds)) {
            return new EOIResponse(false, `Interaction rule references unknown secondary detection config: ${secondaryConfigId}`);
        }

        return EOIResponse.success();
    }

    private static getDetectionConfigIds(detectionConfigs: EOIDetectionConfig[] | undefined): Set<string> {
        const ids = new Set<string>();

        (detectionConfigs ?? []).forEach((detectionConfig, index) => {
            const configId = detectionConfig.config_id == null ? "" : String(detectionConfig.config_id).trim();
            if (configId.length > 0) {
                ids.add(configId);
            }
            ids.add(`dc_${index + 1}`);
            ids.add(String(index));
        });

        return ids;
    }

    private static isKnownDetectionConfigId(configId: string | null | undefined, detectionConfigIds: Set<string>): boolean {
        const normalized = configId == null ? "" : String(configId).trim();
        return normalized.length > 0 && detectionConfigIds.has(normalized);
    }

    private static ruleHasAction(rule: EOIRule, actionType: string): boolean {
        return (rule.actions ?? []).some((action) => String(action?.type ?? "").trim().toLowerCase() === actionType);
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
                    else if (detection_config.class_name != null) {
                        if (!EOIValidator.VALID_CLASS_NAMES.includes(detection_config.class_name.trim())) {
                            response = new EOIResponse(false, `In detection configurations, class name is not valid. Class name is ${detection_config.class_name}`);
                        }
                    }

                    if (response.success) {
                        response = this.validateObjectDescriptions(detection_config.object_descriptions, validateForVideo);
                    }

                    if (response.success && detection_config.face_recognition != null) {
                        response = this.validateFaceRecognitionConfig(detection_config.face_recognition.match_type, detection_config.face_recognition.person, detection_config.face_recognition.group);
                    }

                    if (response.success && detection_config.similarity != null) {
                        response = this.validateSimilarityConfig(detection_config.similarity);
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
        let response: EOIResponse = EOIResponse.success();

        if (polygon != null) {
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

    public static validateStreamId(stream_id: string): EOIResponse {
        const trimmedId = stream_id == null ? null : stream_id.trim();

        return trimmedId != null && trimmedId.length > 0 ?
            EOIResponse.success()
            : new EOIResponse(false, "The stream id must not be null or empty");
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
            const trimmedPersonId = person_id == null ? null : person_id.trim();
            const trimmedGroupId = group_id == null ? null : group_id.trim();

            if (match_type != null) {
                match_type = match_type.trim().toLowerCase();
            }

            if (match_type == null || !EOIValidator.VALID_FACE_REC_MATCH_TYPE_NAMES.includes(match_type)) {
                response = new EOIResponse(false, `Invalid face recognition match type. Value is ${match_type}`);
            }

            // validate person / group match params
            if (response.success) {
                if (match_type == "person") {
                    if (trimmedPersonId == null || trimmedPersonId.length < EOIValidator.MIN_FACEREC_PERSON_ID_LENGTH) {
                        response = new EOIResponse(false, `Invalid face recognition person id. Value is ${person_id}`);
                    }
                }
                else if (match_type == "group") {
                    if (trimmedGroupId == null || trimmedGroupId.length < EOIValidator.MIN_FACEREC_GROUP_ID_LENGTH) {
                        response = new EOIResponse(false, `Invalid face recognition group id. Value is ${group_id}`);
                    }
                }
            }
        }

        return response;
    }

    public static validateSimilarityImage(image: EOISimilarityImage): EOIResponse {
        if (image == null) {
            return new EOIResponse(false, "Similarity image must be provided");
        }

        const trimmedSeedId = image.seed_id == null ? null : image.seed_id.trim();
        const trimmedImage = image.image == null ? null : image.image.trim();
        const seedIdValid = trimmedSeedId != null && trimmedSeedId.length >= EOIValidator.MIN_SEED_ID_LENGTH;
        const imageValid = trimmedImage != null && trimmedImage.length >= EOIValidator.MIN_IMAGE_LENGTH;

        if (!seedIdValid && !imageValid) {
            return new EOIResponse(false, "Please provide a valid seed_id or base64 image string");
        }

        if (image.alert && image.threshold == null) {
            return new EOIResponse(false, "Similarity image threshold is required when alert is true");
        }

        if (image.threshold != null &&
            (image.threshold < EOIValidator.MIN_CONFIDENCE_THRESHOLD || image.threshold > EOIValidator.MAX_CONFIDENCE_THRESHOLD)) {
            return new EOIResponse(false, `Similarity image threshold must be between ${EOIValidator.MIN_CONFIDENCE_THRESHOLD} and ${EOIValidator.MAX_CONFIDENCE_THRESHOLD}. Value is ${image.threshold}`);
        }

        return EOIResponse.success();
    }

    public static validateSimilarityConfig(similarity: EOISimilarityConfig | undefined): EOIResponse {
        if (similarity == null) {
            return new EOIResponse(false, "Similarity configuration must be provided");
        }

        if (similarity.images == null || similarity.images.length === 0) {
            return new EOIResponse(false, "Invalid similarity configuration. Please provide at least one valid similarity image");
        }

        for (let i = 0; i < similarity.images.length; i++) {
            const imageResponse = this.validateSimilarityImage(similarity.images[i]);

            if (!imageResponse.success) {
                return new EOIResponse(false, `Invalid similarity image at index ${i}. ${imageResponse.message}`);
            }
        }

        return EOIResponse.success();
    }
}
