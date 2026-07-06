import { describe, expect, it } from "vitest";
import {
  EOIAddFacerecGroupInputs,
  EOIArchiveSearchInputs,
  EOIDetectionCondition,
  EOIDetectionConfig,
  EOIFacerecPersonDetailsResponse,
  EOIGetAllStreamsInfoResponse,
  EOIGetInteractionEventSummaryResponse,
  EOIGetInteractionEventsResponse,
  EOIGetInteractionHeatmapResponse,
  EOIGetStreamDetailsResponse,
  EOIGetVideoFrameResponse,
  EOIGetVideoStatusResponse,
  EOILicenseValidityResponse,
  EOILine,
  EOILiveSearchInputs,
  EOILiveSearchResponse,
  EOIObjectDescription,
  EOIProcessVideoResponse,
  EOIResponse,
  EOIRule,
  EOIRuleAction,
  EOIRuleCondition,
  EOIValidator,
  EOIVertex,
} from "../src";

const STREAM_URL = "rtsp://camera.example.test/main";

function successResponse(data: unknown = {}, message = "ok"): EOIResponse {
  const response = new EOIResponse(true, message);
  response.data = data;
  return response;
}

function detectionConfig(configId = "person-config"): EOIDetectionConfig {
  const config = EOIDetectionConfig.default();
  config.config_id = configId;
  config.class_name = "person";
  config.class_threshold = 60;
  config.object_descriptions = [
    new EOIObjectDescription("person wearing a safety vest", false, true, 70),
  ];
  return config;
}

function line(name = "entry-line"): EOILine {
  return new EOILine(name, [
    new EOIVertex(0, 0),
    new EOIVertex(100, 0),
  ]);
}

describe("EOIValidator", () => {
  it("rejects invalid archive search date ranges before REST calls", () => {
    const inputs = new EOIArchiveSearchInputs();
    inputs.object_description = "person";
    inputs.start_date_time = "2026-07-04T19:00:00Z";
    inputs.end_date_time = "2026-07-04T18:00:00Z";

    const response = inputs.validate();

    expect(response.success).toBe(false);
    expect(response.message).toContain("start_date_time must be before end_date_time");
  });

  it("rejects live searches with invalid thresholds or durations", () => {
    const inputs = new EOILiveSearchInputs();
    inputs.object_description = "person";
    inputs.alert_threshold = 100;
    inputs.duration_seconds = 10;

    const thresholdResponse = inputs.validate();
    inputs.alert_threshold = 50;
    inputs.duration_seconds = -1;
    const durationResponse = inputs.validate();

    expect(thresholdResponse.success).toBe(false);
    expect(thresholdResponse.message).toContain("live search threshold");
    expect(durationResponse.success).toBe(false);
    expect(durationResponse.message).toContain("live search duration");
  });

  it("rejects duplicate object descriptions and line-cross conditions that reference unknown lines", () => {
    const duplicateDescriptions = EOIValidator.validateObjectDescriptions([
      new EOIObjectDescription("person", false, true, 70),
      new EOIObjectDescription("person", false, true, 80),
    ], true);
    const config = detectionConfig();
    config.conditions = [
      new EOIDetectionCondition("line_cross", null, "missing-line", "positive"),
    ];

    const lineCrossResponse = EOIValidator.validateDetectionConfigs([config], [line("entry-line")], true);

    expect(duplicateDescriptions.success).toBe(false);
    expect(duplicateDescriptions.message).toContain("duplicate object description");
    expect(lineCrossResponse.success).toBe(false);
    expect(lineCrossResponse.message).toContain("does not match any line names");
  });

  it("validates rule references and action/timing constraints", () => {
    const config = detectionConfig("person-config");
    const validRule = new EOIRule({
      condition: new EOIRuleCondition({
        type: "count",
        detection_config_id: "person-config",
        operator: "greater_than",
        count: 0,
      }),
      actions: [new EOIRuleAction({ type: "alert" })],
      dwell_seconds: 0.1,
    });
    const unknownConfigRule = new EOIRule({
      condition: new EOIRuleCondition({
        type: "count",
        detection_config_id: "missing-config",
        count: 1,
      }),
      actions: [new EOIRuleAction({ type: "alert" })],
    });
    const badTimingRule = new EOIRule({
      condition: new EOIRuleCondition({
        type: "count",
        detection_config_id: "person-config",
        count: 1,
      }),
      actions: [new EOIRuleAction({ type: "alert", pre_roll_seconds: -1 })],
    });

    expect(EOIValidator.validateRules([validRule], [config]).success).toBe(true);
    expect(EOIValidator.validateRules([unknownConfigRule], [config]).message).toContain("unknown detection config");
    expect(EOIValidator.validateRules([badTimingRule], [config]).message).toContain("pre_roll_seconds");
  });

  it("validates face recognition group inputs with field-specific errors", () => {
    const response = new EOIAddFacerecGroupInputs("g", "Warehouse", "long enough description").validate();

    expect(response.success).toBe(false);
    expect(response.message).toContain("group ID");
  });
});

describe("output mappers", () => {
  it("maps stream response wrappers into stream info objects", () => {
    const stream = {
      schema_version: "2.0",
      stream_url: STREAM_URL,
      stream_id: "stream-1",
      name: "Main Camera",
      status: "ALERTING",
      frame_rate: 5,
      index_for_search: true,
      search_index_types: ["object"],
      regions: [],
      lines: [],
    };

    const allStreams = new EOIGetAllStreamsInfoResponse(successResponse({ streams: [stream] }));
    const details = new EOIGetStreamDetailsResponse(successResponse({ stream }));

    expect(allStreams.streams).toHaveLength(1);
    expect(allStreams.streams[0].isAlerting()).toBe(true);
    expect(details.stream.stream_id).toBe("stream-1");
    expect(details.stream.isMonitoring()).toBe(true);
  });

  it("maps interaction event lists, summaries, heatmaps, and defaults", () => {
    const events = new EOIGetInteractionEventsResponse(successResponse({
      total: 2,
      events: [
        {
          event_id: "event-1",
          stream_id: "stream-1",
          stream_url: STREAM_URL,
          rule_id: "rule-1",
          rule_type: "count",
          mode: "tracking",
          track_ids: [1, "2"],
          started_at: 100,
          last_seen_at: 110,
          metadata: { source: "test" },
        },
        null,
      ],
    }));
    const summary = new EOIGetInteractionEventSummaryResponse(successResponse({
      summary: {
        total: 2,
        by_rule_type: { count: 2 },
        by_status: { New: 1, Confirmed: 1 },
      },
    }));
    const heatmap = new EOIGetInteractionHeatmapResponse(successResponse({
      heatmap: {
        coordinate_space: "camera",
        fallback_from: "world",
        bin_count_x: 4,
        bin_count_y: 3,
        bins: [{ x: 1, y: 2, count: 7 }, null],
        events_with_points: 7,
        events_without_points: 2,
        frame_width: 1920,
        frame_height: 1080,
      },
    }));

    expect(events.total).toBe(2);
    expect(events.events).toHaveLength(1);
    expect(events.events[0].stream_id).toBe("stream-1");
    expect(events.events[0].status).toBe("New");
    expect(events.events[0].track_ids).toEqual(["1", "2"]);
    expect(events.events[0].metadata).toEqual({ source: "test" });
    expect(summary.summary.total).toBe(2);
    expect(summary.summary.by_rule_type).toEqual({ count: 2 });
    expect(summary.summary.by_region).toEqual({});
    expect(summary.summary.by_status).toEqual({ New: 1, Confirmed: 1 });
    expect(heatmap.heatmap.coordinate_space).toBe("camera");
    expect(heatmap.heatmap.fallback_from).toBe("world");
    expect(heatmap.heatmap.bins).toEqual([{ x: 1, y: 2, count: 7 }]);
    expect(heatmap.heatmap.events_with_points).toBe(7);
    expect(heatmap.heatmap.frame_width).toBe(1920);
  });

  it("maps video, license, live-search, frame, and face-recognition responses", () => {
    const video = new EOIProcessVideoResponse(successResponse({ video_id: 42 }));
    const videoStatus = new EOIGetVideoStatusResponse(successResponse({ video: { status: "running", progress: 50 } }));
    const frame = new EOIGetVideoFrameResponse(successResponse({ image: "frame-base64" }));
    const license = new EOILicenseValidityResponse(successResponse({ entered: true, valid: false }));
    const liveSearch = new EOILiveSearchResponse(successResponse({ search_id: 99 }));
    const person = new EOIFacerecPersonDetailsResponse(successResponse({
      person_id: "person-1",
      person_name: "Jane Doe",
      groups: [{ external_id: "group-1", display_name: "Warehouse Team" }],
      images: [{ path: "/faces/jane.jpg", image: "image-base64" }],
    }));

    expect(video.video_id).toBe(42);
    expect(videoStatus.video).toEqual({ status: "running", progress: 50 });
    expect(frame.image).toBe("frame-base64");
    expect(license.entered).toBe(true);
    expect(license.valid).toBe(false);
    expect(liveSearch.search_id).toBe(99);
    expect(person.person_id).toBe("person-1");
    expect(person.groups[0]).toMatchObject({ external_id: "group-1", display_name: "Warehouse Team" });
    expect(person.images[0]).toMatchObject({ path: "/faces/jane.jpg", image: "image-base64" });
  });
});
