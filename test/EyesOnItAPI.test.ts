import { describe, expect, it } from "vitest";
import {
  EOI_CURRENT_SCHEMA_VERSION,
  EOIAddStreamInputs,
  EOIDetectionConfig,
  EOIObjectDescription,
  EOIProcessImageInputs,
  EOIRegion,
  EOIResponse,
  EOIVertex,
  EyesOnItAPI,
  type IEOIRESTHandler,
} from "../src";

const API_BASE_URL = "https://api.example.test";

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

function successResponse(data: unknown, message = "ok"): EOIResponse {
  const response = new EOIResponse(true, message);
  response.data = data;
  return response;
}

function createApi(restHandler: IEOIRESTHandler): EyesOnItAPI {
  return new EyesOnItAPI(API_BASE_URL, restHandler, noopLogger);
}

function createRegion(): EOIRegion {
  const detectionConfig = EOIDetectionConfig.default();
  detectionConfig.config_id = "person-config";
  detectionConfig.class_name = "person";
  detectionConfig.class_threshold = 50;
  detectionConfig.object_descriptions = [
    new EOIObjectDescription("person wearing red", false, true, 55, 77, true),
  ];

  const region = new EOIRegion();
  region.id = 7;
  region.name = "entry";
  region.polygon = [
    new EOIVertex(0, 0),
    new EOIVertex(100, 0),
    new EOIVertex(100, 100),
  ];
  region.detection_configs = [detectionConfig];

  return region;
}

describe("EyesOnItAPI REST behavior", () => {
  it("calls the configured GET endpoint and maps health response data", async () => {
    const rawHealth = {
      gpus: [{ index: 0, util_pct: 42, mem_pct: 33 }],
      system: { cpu_pct: 19, ram_pct: 61 },
    };
    const restHandler = new FakeRESTHandler([successResponse(rawHealth, "healthy")]);

    const result = await createApi(restHandler).health();

    expect(restHandler.getCalls).toEqual([`${API_BASE_URL}/health`]);
    expect(restHandler.postCalls).toHaveLength(0);
    expect(result.success).toBe(true);
    expect(result.message).toBe("healthy");
    expect(result.data).toEqual(rawHealth);
    expect(result.gpus).toHaveLength(1);
    expect(result.gpus[0].index).toBe(0);
    expect(result.system?.cpu_pct).toBe(19);
  });

  it("returns a validation error without calling REST for an empty processImage payload", async () => {
    const restHandler = new FakeRESTHandler([], [successResponse({})]);
    const inputs = new EOIProcessImageInputs("", [createRegion()]);

    const result = await createApi(restHandler).processImage(inputs);

    expect(result.success).toBe(false);
    expect(result.message).toBe("image must not be null or empty");
    expect(restHandler.getCalls).toHaveLength(0);
    expect(restHandler.postCalls).toHaveLength(0);
  });

  it("posts processImage to the expected endpoint with headers and wraps detections", async () => {
    const restHandler = new FakeRESTHandler([], [
      successResponse(
        {
          detections: [{ region: "entry", class_name: "person", objects: [] }],
          image: "annotated-base64",
        },
        "processed",
      ),
    ]);
    const inputs = new EOIProcessImageInputs("raw-base64", [createRegion()], true);

    const result = await createApi(restHandler).processImage(inputs);

    expect(restHandler.postCalls).toHaveLength(1);
    expect(restHandler.postCalls[0]).toMatchObject({
      endPoint: `${API_BASE_URL}/process_image`,
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    expect(restHandler.postCalls[0].body).toMatchObject({
      base64Image: "raw-base64",
      file: "raw-base64",
      return_image: true,
      regions: [expect.objectContaining({ name: "entry" })],
    });
    expect(result.success).toBe(true);
    expect(result.message).toBe("processed");
    expect(result.image).toBe("annotated-base64");
    expect(result.detections).toHaveLength(1);
    expect(result.detections[0].region).toBe("entry");
    expect(result.detections[0].class_name).toBe("person");
  });

  it("posts addStream to the expected endpoint with schema version and serialized body", async () => {
    const restHandler = new FakeRESTHandler([], [successResponse({}, "stream added")]);
    const inputs = new EOIAddStreamInputs(
      "rtsp://camera.example.test/main",
      "Front Door",
      1920,
      1080,
      5,
      true,
      ["object"],
      [createRegion()],
      undefined,
      undefined,
      undefined,
      undefined,
    );

    const result = await createApi(restHandler).addStream(inputs);

    expect(restHandler.postCalls).toHaveLength(1);
    expect(restHandler.postCalls[0].endPoint).toBe(`${API_BASE_URL}/add_stream`);
    expect(restHandler.postCalls[0].body).toMatchObject({
      schema_version: EOI_CURRENT_SCHEMA_VERSION,
      stream_url: "rtsp://camera.example.test/main",
      name: "Front Door",
      frame_width: 1920,
      frame_height: 1080,
      frame_rate: 5,
      index_for_search: true,
      search_index_types: ["object"],
      regions: [
        expect.objectContaining({
          name: "entry",
          detection_configs: [
            expect.objectContaining({
              config_id: "person-config",
              class_name: "person",
              class_threshold: 50,
            }),
          ],
        }),
      ],
    });
    expect(
      (restHandler.postCalls[0].body as { regions: Array<{ detection_configs: Array<{ object_descriptions: Array<{ confidence?: number }> }> }> })
        .regions[0].detection_configs[0].object_descriptions[0].confidence,
    ).toBeUndefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe("stream added");
  });

  it("rejects invalid stream URLs before calling the REST handler", async () => {
    const restHandler = new FakeRESTHandler([], [successResponse({})]);

    const result = await createApi(restHandler).removeStream("   ");

    expect(result.success).toBe(false);
    expect(result.message).toBe("The stream url must be a valid RTSP URL");
    expect(restHandler.getCalls).toHaveLength(0);
    expect(restHandler.postCalls).toHaveLength(0);
  });
});
