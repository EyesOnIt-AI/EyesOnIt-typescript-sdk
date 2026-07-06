import { beforeEach, describe, expect, it, vi } from "vitest";

const socketMock = vi.hoisted(() => {
  type Handler = (...args: unknown[]) => void;

  class FakeSocket {
    public connected = false;
    public emitted: Array<{ event: string; payload: unknown }> = [];
    private readonly handlers = new Map<string, Set<Handler>>();

    public on(event: string, handler: Handler): this {
      const eventHandlers = this.handlers.get(event) ?? new Set<Handler>();
      eventHandlers.add(handler);
      this.handlers.set(event, eventHandlers);
      return this;
    }

    public once(event: string, handler: Handler): this {
      const onceHandler: Handler = (...args) => {
        this.off(event, onceHandler);
        handler(...args);
      };

      return this.on(event, onceHandler);
    }

    public off(event: string, handler: Handler): this {
      this.handlers.get(event)?.delete(handler);
      return this;
    }

    public emit(event: string, payload: unknown): this {
      this.emitted.push({ event, payload });
      return this;
    }

    public connect(): this {
      this.connected = true;
      this.trigger("connect");
      return this;
    }

    public disconnect(): this {
      this.connected = false;
      this.trigger("disconnect", "io client disconnect");
      return this;
    }

    public trigger(event: string, ...args: unknown[]): void {
      const eventHandlers = this.handlers.get(event) ?? new Set<Handler>();
      for (const handler of [...eventHandlers]) {
        handler(...args);
      }
    }
  }

  const sockets: FakeSocket[] = [];

  return {
    FakeSocket,
    io: vi.fn(() => {
      const socket = new FakeSocket();
      sockets.push(socket);
      return socket;
    }),
    sockets,
  };
});

vi.mock("socket.io-client", () => ({
  io: socketMock.io,
  Socket: socketMock.FakeSocket,
}));

import {
  EOIAddStreamInputs,
  EOIDetectionConfig,
  EOIObjectDescription,
  EOIRegion,
  EOIResponse,
  EOISearchResponse,
  EOISocketClient,
  EOIVertex,
} from "../src";

function successResponse(data: unknown, message = "ok"): EOIResponse {
  const response = new EOIResponse(true, message);
  response.data = data;
  return response;
}

function createRegion(): EOIRegion {
  const detectionConfig = EOIDetectionConfig.default();
  detectionConfig.config_id = "person-contract";
  detectionConfig.class_name = "person";
  detectionConfig.class_threshold = 65;
  detectionConfig.object_descriptions = [
    new EOIObjectDescription("person in safety vest", false, true, 70, 92, true),
  ];

  const region = new EOIRegion();
  region.id = 3;
  region.name = "dock";
  region.polygon = [
    new EOIVertex(0, 0),
    new EOIVertex(640, 0),
    new EOIVertex(640, 360),
    new EOIVertex(0, 360),
  ];
  region.detection_configs = [detectionConfig];

  return region;
}

describe("API contract snapshots", () => {
  it("keeps the representative addStream request body stable", () => {
    const inputs = new EOIAddStreamInputs(
      "rtsp://camera.example.test/dock",
      "Dock Camera",
      1280,
      720,
      4,
      true,
      ["object"],
      [createRegion()],
      undefined,
      undefined,
      undefined,
      undefined,
    );
    const body = inputs.toRequestBody();
    const contract = {
      schema_version: body.schema_version,
      stream_url: body.stream_url,
      name: body.name,
      frame_width: body.frame_width,
      frame_height: body.frame_height,
      frame_rate: body.frame_rate,
      index_for_search: body.index_for_search,
      search_index_types: body.search_index_types,
      regions: body.regions.map((region: any) => ({
        id: region.id,
        enabled: region.enabled,
        name: region.name,
        polygon: region.polygon,
        detection_configs: region.detection_configs.map((detectionConfig: any) => ({
          config_id: detectionConfig.config_id,
          class_name: detectionConfig.class_name,
          class_threshold: detectionConfig.class_threshold,
          object_size: detectionConfig.object_size,
          object_descriptions: detectionConfig.object_descriptions,
          alert_seconds: detectionConfig.alert_seconds,
          reset_seconds: detectionConfig.reset_seconds,
        })),
      })),
    };

    expect(contract).toMatchInlineSnapshot(`
      {
        "frame_height": 720,
        "frame_rate": 4,
        "frame_width": 1280,
        "index_for_search": true,
        "name": "Dock Camera",
        "regions": [
          {
            "detection_configs": [
              {
                "alert_seconds": 5,
                "class_name": "person",
                "class_threshold": 65,
                "config_id": "person-contract",
                "object_descriptions": [
                  {
                    "alert": true,
                    "background_prompt": false,
                    "text": "person in safety vest",
                    "threshold": 70,
                  },
                ],
                "object_size": 100,
                "reset_seconds": 10,
              },
            ],
            "enabled": true,
            "id": 3,
            "name": "dock",
            "polygon": [
              {
                "x": 0,
                "y": 0,
              },
              {
                "x": 640,
                "y": 0,
              },
              {
                "x": 640,
                "y": 360,
              },
              {
                "x": 0,
                "y": 360,
              },
            ],
          },
        ],
        "schema_version": "2.0",
        "search_index_types": [
          "object",
        ],
        "stream_url": "rtsp://camera.example.test/dock",
      }
    `);
  });

  it("keeps a representative search response wrapper stable", () => {
    const response = new EOISearchResponse(successResponse({
      results: [
        {
          confidence: 91,
          source_type: "archive",
          folder: "/data/archive",
          file: "frame-001.jpg",
          stream_url: "rtsp://camera.example.test/dock",
          stream_name: "Dock Camera",
          region: "dock",
          class_name: "person",
          time: "2026-07-04T18:15:00Z",
          image: "image-base64",
          person_id: "person-42",
          facerec_person_display_name: "Jane Doe",
          result_id: "result-123",
        },
      ],
    }, "found"));
    const contract = {
      success: response.success,
      message: response.message,
      results: response.results.map((result) => ({
        confidence: result.confidence,
        source_type: result.source_type,
        stream: result.stream,
        stream_name: result.stream_name,
        region: result.region,
        class_name: result.class_name,
        time: result.time,
        facerec_person_id: result.facerec_person_id,
        facerec_person_display_name: result.facerec_person_display_name,
        result_id: result.result_id,
      })),
    };

    expect(contract).toMatchInlineSnapshot(`
      {
        "message": "found",
        "results": [
          {
            "class_name": "person",
            "confidence": 91,
            "facerec_person_display_name": "Jane Doe",
            "facerec_person_id": "person-42",
            "region": "dock",
            "result_id": "result-123",
            "source_type": "archive",
            "stream": "rtsp://camera.example.test/dock",
            "stream_name": "Dock Camera",
            "time": "2026-07-04T18:15:00Z",
          },
        ],
        "success": true,
      }
    `);
  });
});

describe("socket payload parsing contracts", () => {
  beforeEach(() => {
    socketMock.sockets.length = 0;
    socketMock.io.mockClear();
  });

  it("parses representative stream, detection, and performance payloads", () => {
    const streamUpdates: unknown[] = [];
    const streamDetections: unknown[] = [];
    const performanceUpdates: unknown[] = [];

    new EOISocketClient({
      apiBaseUrl: "https://api.example.test",
      clientId: "client-1",
      handlers: {
        handleStreamUpdate: (message) => {
          streamUpdates.push(message);
        },
        handleStreamDetection: (message) => {
          streamDetections.push({
            room: message.room,
            image: message.image,
            detections: message.detections.map((detection) => ({
              region: detection.region,
              class_name: detection.class_name,
              stream_url: detection.stream_url,
              stream_name: detection.stream_name,
              time: detection.time?.toUTC().toISO({ suppressMilliseconds: true }),
              max_confidence_description: detection.getMaxConfidenceDescription(),
            })),
          });
        },
        handlePerformanceUpdate: (message) => {
          performanceUpdates.push(message);
        },
      },
    });

    const socket = socketMock.sockets[0];
    expect(socketMock.io).toHaveBeenCalledWith("https://api.example.test", expect.objectContaining({
      autoConnect: false,
      path: "/websocket",
      query: { client_id: "client-1" },
    }));

    socket.trigger("stream_update", {
      schema_version: 2,
      server_instance_id: "server-a",
      room: "streams",
      message_type: "snapshot",
      sequence: 1,
      sent_at: "2026-07-04T18:00:00Z",
      streams: [
        {
          stream_id: "stream-1",
          stream_url: "rtsp://camera.example.test/dock",
          name: "Dock Camera",
          status: "running",
        },
      ],
    });
    socket.trigger("stream_detection", "stream:dock", {
      detections: [
        {
          region: "dock",
          class_name: "person",
          stream_url: "rtsp://camera.example.test/dock",
          stream_name: "Dock Camera",
          time: "2026-07-04T18:01:00Z",
          condition: {
            type: "count_equals",
            count: 1,
            objects: [
              {
                detection_types: ["natural_language"],
                object_descriptions: [
                  {
                    text: "person in safety vest",
                    confidence: 88,
                  },
                ],
              },
            ],
          },
        },
      ],
      image: "frame-base64",
    });
    socket.trigger("performance_update", {
      schema_version: 2,
      server_instance_id: "server-a",
      sequence: 5,
      sent_at: "2026-07-04T18:02:00Z",
      gpus: [
        { index: "0", util_pct: "71", vram_pct: "82" },
        { index: "not-a-number", util_pct: 100, vram_pct: 100 },
      ],
      system: { cpu_pct: "33.4", ram_pct: null },
    });

    expect(streamUpdates).toMatchInlineSnapshot(`
      [
        {
          "message_type": "snapshot",
          "room": "streams",
          "schema_version": 2,
          "sent_at": "2026-07-04T18:00:00Z",
          "sequence": 1,
          "server_instance_id": "server-a",
          "streams": [
            {
              "name": "Dock Camera",
              "status": "running",
              "stream_id": "stream-1",
              "stream_url": "rtsp://camera.example.test/dock",
            },
          ],
        },
      ]
    `);
    expect(streamDetections).toMatchInlineSnapshot(`
      [
        {
          "detections": [
            {
              "class_name": "person",
              "max_confidence_description": "person in safety vest",
              "region": "dock",
              "stream_name": "Dock Camera",
              "stream_url": "rtsp://camera.example.test/dock",
              "time": "2026-07-04T18:01:00Z",
            },
          ],
          "image": "frame-base64",
          "room": "stream:dock",
        },
      ]
    `);
    expect(performanceUpdates).toMatchInlineSnapshot(`
      [
        {
          "gpus": [
            {
              "index": 0,
              "util_pct": 71,
              "vram_pct": 82,
            },
          ],
          "schema_version": 2,
          "sent_at": "2026-07-04T18:02:00Z",
          "sequence": 5,
          "server_instance_id": "server-a",
          "system": {
            "cpu_pct": 33.4,
            "ram_pct": null,
          },
        },
      ]
    `);
  });
});
