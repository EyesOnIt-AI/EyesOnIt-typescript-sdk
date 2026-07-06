import { describe, expect, it } from "vitest";
import {
  EOIAddFacerecGroupInputs,
  EOIAddFacerecPeopleInputs,
  EOIAddFacerecPersonInputs,
  EOIArchiveSearchInputs,
  EOIGetInteractionEventSummaryInputs,
  EOIGetInteractionEventsInputs,
  EOIGetVideoStatusInputs,
  EOILiveSearchInputs,
  EOIMonitorStreamInputs,
  EOIResponse,
  EOIStopVideoInputs,
  EOIUpdateConfigInputs,
  EOIUpdateInteractionEventStatusInputs,
  EOIUpdateLiveSearchInputs,
  EOIValidateLicenseInputs,
  EyesOnItAPI,
  type IEOIRESTHandler,
} from "../src";

const API_BASE_URL = "https://api.example.test";
const STREAM_URL = "rtsp://camera.example.test/main";

const noopLogger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

type RecordedPost = {
  endPoint: string;
  body: unknown;
  headers: unknown;
};

class FakeRESTHandler implements IEOIRESTHandler {
  public getCalls: string[] = [];
  public postCalls: RecordedPost[] = [];

  constructor(
    private readonly getResponses: EOIResponse[] = [],
    private readonly postResponses: EOIResponse[] = [],
  ) {}

  public async get(endPoint: string): Promise<EOIResponse> {
    this.getCalls.push(endPoint);
    return this.getResponses.shift() ?? EOIResponse.success();
  }

  public async post(endPoint: string, body: unknown, headers: Record<string, string>): Promise<EOIResponse> {
    this.postCalls.push({ endPoint, body, headers });
    return this.postResponses.shift() ?? EOIResponse.success();
  }
}

function successResponse(data: unknown = {}, message = "ok"): EOIResponse {
  const response = new EOIResponse(true, message);
  response.data = data;
  return response;
}

function createApi(restHandler: IEOIRESTHandler): EyesOnItAPI {
  return new EyesOnItAPI(API_BASE_URL, restHandler, noopLogger);
}

function archiveSearchInputs(): EOIArchiveSearchInputs {
  const inputs = new EOIArchiveSearchInputs();
  inputs.object_description = "person carrying a box";
  inputs.start_date_time = "2026-07-04T18:00:00Z";
  inputs.end_date_time = "2026-07-04T19:00:00Z";
  return inputs;
}

function liveSearchInputs(): EOILiveSearchInputs {
  const inputs = new EOILiveSearchInputs();
  inputs.object_description = "person carrying a box";
  inputs.alert_threshold = 75;
  inputs.duration_seconds = 60;
  inputs.stream_list = [STREAM_URL];
  return inputs;
}

function facePersonInputs(): EOIAddFacerecPersonInputs {
  const inputs = new EOIAddFacerecPersonInputs("person-1", "Jane Doe", ["group-1"]);
  inputs.addImageBase64("x".repeat(100), "/faces/jane.jpg");
  return inputs;
}

function callPath(call: RecordedPost): string {
  return call.endPoint.replace(API_BASE_URL, "");
}

describe("EyesOnItAPI endpoint routing", () => {
  it("routes GET methods to their documented endpoints", async () => {
    const restHandler = new FakeRESTHandler([
      successResponse({ entered: true, valid: true }),
      successResponse({ status: "active" }),
      successResponse({ streams: [] }),
      successResponse({ classes: ["person"] }),
      successResponse({ config: { frame_rate: 5 } }),
      successResponse({ groups: ["group-1"] }),
      successResponse({}),
    ]);
    const api = createApi(restHandler);

    await api.isLicenseValid();
    await api.getLicenseStatus();
    await api.getAllStreamsInfo();
    await api.getSupportedClasses();
    await api.getConfig();
    await api.getFacerecGroups();
    await api.isEoiAlive();

    expect(restHandler.getCalls).toEqual([
      `${API_BASE_URL}/is_license_valid`,
      `${API_BASE_URL}/get_license_status`,
      `${API_BASE_URL}/get_all_streams_info`,
      `${API_BASE_URL}/get_supported_classes`,
      `${API_BASE_URL}/get_config`,
      `${API_BASE_URL}/facerec_groups`,
      `${API_BASE_URL}/is_eoi_alive`,
    ]);
    expect(restHandler.postCalls).toHaveLength(0);
  });

  it("routes stream, video, and license POST methods with expected request bodies", async () => {
    const restHandler = new FakeRESTHandler([], [
      successResponse(),
      successResponse(),
      successResponse(),
      successResponse(),
      successResponse(),
      successResponse({ stream: { stream_url: STREAM_URL, stream_id: "stream-1", name: "Main", status: "MONITORING" } }),
      successResponse({ image: "frame-base64" }),
      successResponse({ video: { status: "running" } }),
    ]);
    const api = createApi(restHandler);

    await api.validateLicense(new EOIValidateLicenseInputs("license-key", "license-token"));
    await api.stopVideo(new EOIStopVideoInputs());
    await api.stopVideo(new EOIStopVideoInputs("video-1"));
    await api.monitorStream(new EOIMonitorStreamInputs(STREAM_URL, 30));
    await api.stopMonitoringStream(STREAM_URL);
    await api.getStreamDetails(STREAM_URL);
    await api.getVideoFrame(STREAM_URL);
    await api.getVideoStatus(new EOIGetVideoStatusInputs("video-1"));

    expect(restHandler.postCalls.map((call) => ({ path: callPath(call), body: call.body }))).toMatchObject([
      { path: "/validate_license", body: { key: "license-key", token: "license-token" } },
      { path: "/stop_video", body: {} },
      { path: "/stop_video", body: { video_id: "video-1" } },
      { path: "/monitor_stream", body: { stream_url: STREAM_URL, duration_seconds: 30 } },
      { path: "/stop_monitoring", body: { stream_url: STREAM_URL } },
      { path: "/get_stream_details", body: { stream_url: STREAM_URL } },
      { path: "/get_video_frame", body: { stream_url: STREAM_URL } },
      { path: "/get_video_status", body: { video_id: "video-1" } },
    ]);
    expect(restHandler.postCalls.every((call) => (
      (call.headers as Record<string, string>)["Content-Type"] === "application/json"
      && (call.headers as Record<string, string>).Accept === "*/*"
    ))).toBe(true);
  });

  it("routes search, interaction, and config POST methods with expected request bodies", async () => {
    const restHandler = new FakeRESTHandler([], [
      successResponse({ results: [] }),
      successResponse({ search_id: 123 }),
      successResponse(),
      successResponse(),
      successResponse(),
      successResponse({ events: [], total: 0 }),
      successResponse({ summary: { total: 2, by_status: { New: 2 } } }),
      successResponse({ event: { event_id: "event-1", stream_url: STREAM_URL, rule_id: "rule-1", rule_type: "count", mode: "tracking", started_at: 1, last_seen_at: 2 } }),
      successResponse(),
    ]);
    const api = createApi(restHandler);
    const eventFilters = new EOIGetInteractionEventsInputs({ limit: 25, offset: 5, status: "New" });
    const summaryFilters = new EOIGetInteractionEventSummaryInputs({ rule_type: "line_cross", status: "Confirmed" });
    const statusUpdate = new EOIUpdateInteractionEventStatusInputs("event-1", "Confirmed", "reviewed");
    const configBody = { processing: { frame_rate: 4 }, features: { sockets: true } };

    await api.searchArchive(archiveSearchInputs());
    await api.searchLive(liveSearchInputs());
    await api.pauseLiveSearch(new EOIUpdateLiveSearchInputs(-1));
    await api.resumeLiveSearch(new EOIUpdateLiveSearchInputs(123));
    await api.cancelLiveSearch(new EOIUpdateLiveSearchInputs(123));
    await api.getInteractionEvents(eventFilters);
    await api.getInteractionEventSummary(summaryFilters);
    await api.updateInteractionEventStatus(statusUpdate);
    await api.updateConfig(new EOIUpdateConfigInputs(configBody));

    expect(restHandler.postCalls.map((call) => ({ path: callPath(call), body: call.body }))).toMatchObject([
      { path: "/archive_search", body: { object_description: "person carrying a box" } },
      { path: "/live_search", body: { object_description: "person carrying a box", alert_threshold: 75, duration_seconds: 60, stream_list: [STREAM_URL] } },
      { path: "/pause_live_search", body: { search_id: -1 } },
      { path: "/resume_live_search", body: { search_id: 123 } },
      { path: "/cancel_live_search", body: { search_id: 123 } },
      { path: "/get_interaction_events", body: { limit: 25, offset: 5, status: "New" } },
      { path: "/get_interaction_event_summary", body: { rule_type: "line_cross", status: "Confirmed" } },
      { path: "/update_interaction_event_status", body: { event_id: "event-1", status: "Confirmed", reviewer_note: "reviewed" } },
      { path: "/update_config", body: configBody },
    ]);
  });

  it("routes face recognition POST methods with expected request bodies", async () => {
    const restHandler = new FakeRESTHandler([], [
      successResponse(),
      successResponse(),
      successResponse(),
      successResponse(),
      successResponse(),
      successResponse({ names: ["Warehouse Team"] }),
      successResponse({ names: ["Jane Doe"] }),
      successResponse({
        person_id: "person-1",
        person_name: "Jane Doe",
        groups: [{ external_id: "group-1", display_name: "Warehouse Team" }],
        images: [{ path: "/faces/jane.jpg", image: "image-base64" }],
      }),
    ]);
    const api = createApi(restHandler);

    await api.addFacerecGroup(new EOIAddFacerecGroupInputs("group-1", "Warehouse Team", "Warehouse staff group"));
    await api.removeFacerecGroup("group-1");
    await api.addFacerecPerson(facePersonInputs());
    await api.addFacerecPeople(new EOIAddFacerecPeopleInputs("/imports/people.csv"));
    await api.removeFacerecPerson("person-1");
    await api.searchFacerecGroupNames("warehouse");
    await api.searchFacerecPeopleNames("jane");
    await api.getFacerecPersonDetails("person-1");

    expect(restHandler.postCalls.map((call) => ({ path: callPath(call), body: call.body }))).toMatchObject([
      { path: "/facerec_add_group", body: { group_id: "group-1", group_name: "Warehouse Team", group_description: "Warehouse staff group" } },
      { path: "/facerec_remove_group", body: { group_id: "group-1" } },
      {
        path: "/facerec_add_person",
        body: {
          person_id: "person-1",
          person_display_name: "Jane Doe",
          person_groups: ["group-1"],
          person_images: [expect.objectContaining({ image: "x".repeat(100), file_path: "/faces/jane.jpg" })],
        },
      },
      { path: "/facerec_add_people", body: { file_path: "/imports/people.csv" } },
      { path: "/facerec_remove_person", body: { person_id: "person-1" } },
      { path: "/facerec_search_group_names", body: { search_text: "warehouse" } },
      { path: "/facerec_search_people_names", body: { search_text: "jane" } },
      { path: "/facerec_person_details", body: { person_id: "person-1" } },
    ]);
  });
});
