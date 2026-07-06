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
      queueMicrotask(() => {
        this.connected = true;
        this.trigger("connect");
      });
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

    public clearEmitted(): void {
      this.emitted = [];
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

import { EOISocketClient } from "../src";

function streamUpdate(sequence: number, serverInstanceId = "server-a", messageType: "snapshot" | "delta" = "delta"): Record<string, unknown> {
  return {
    schema_version: 2,
    server_instance_id: serverInstanceId,
    room: "streams",
    message_type: messageType,
    sequence,
    sent_at: `2026-07-04T18:00:0${sequence}Z`,
    streams: messageType === "snapshot" ? [] : undefined,
    changes: messageType === "delta" ? [] : undefined,
  };
}

describe("EOISocketClient connection behavior", () => {
  beforeEach(() => {
    socketMock.sockets.length = 0;
    socketMock.io.mockClear();
  });

  it("subscribes queued rooms on connect and re-subscribes them after reconnect", async () => {
    const disconnectReasons: string[] = [];
    const client = new EOISocketClient({
      apiBaseUrl: "https://api.example.test",
      clientId: "client-1",
      autoJoinRooms: ["streams"],
      handlers: {
        handleDisconnect: (reason) => {
          disconnectReasons.push(reason);
        },
      },
    });
    const socket = socketMock.sockets[0];

    client.joinRoom("stream:front-door");
    await client.connect();

    expect(socket.emitted).toEqual([
      { event: "subscribe", payload: { room: "streams" } },
      { event: "subscribe", payload: { room: "stream:front-door" } },
    ]);

    socket.clearEmitted();
    socket.disconnect();
    await client.connect();

    expect(disconnectReasons).toEqual(["io client disconnect"]);
    expect(socket.emitted).toEqual([
      { event: "subscribe", payload: { room: "streams" } },
      { event: "subscribe", payload: { room: "stream:front-door" } },
    ]);
  });

  it("emits unsubscribe only for connected rooms and stops rejoining removed rooms", async () => {
    const client = new EOISocketClient({
      apiBaseUrl: "https://api.example.test",
      clientId: "client-1",
      autoJoinRooms: ["streams", "performance"],
    });
    const socket = socketMock.sockets[0];

    await client.connect();
    socket.clearEmitted();
    client.leaveRoom("performance");

    expect(socket.emitted).toEqual([
      { event: "unsubscribe", payload: { room: "performance" } },
    ]);

    socket.clearEmitted();
    socket.disconnect();
    await client.connect();

    expect(socket.emitted).toEqual([
      { event: "subscribe", payload: { room: "streams" } },
    ]);
  });

  it("suppresses stale stream updates, requests snapshots after gaps, and resets sequence state by server instance", async () => {
    const handledSequences: number[] = [];
    const client = new EOISocketClient({
      apiBaseUrl: "https://api.example.test",
      clientId: "client-1",
      handlers: {
        handleStreamUpdate: (message) => {
          handledSequences.push(message.sequence);
        },
      },
    });
    const socket = socketMock.sockets[0];

    await client.connect();
    socket.clearEmitted();
    socket.trigger("stream_update", streamUpdate(1, "server-a", "snapshot"));
    socket.trigger("stream_update", streamUpdate(1, "server-a", "delta"));
    socket.trigger("stream_update", streamUpdate(3, "server-a", "delta"));
    socket.trigger("stream_update", streamUpdate(2, "server-a", "delta"));
    socket.trigger("stream_update", streamUpdate(1, "server-b", "snapshot"));

    expect(handledSequences).toEqual([1, 3, 1]);
    expect(socket.emitted).toContainEqual({
      event: "request_snapshot",
      payload: { room: "streams" },
    });
  });
});
