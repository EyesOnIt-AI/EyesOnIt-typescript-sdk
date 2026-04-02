import { io, Socket } from "socket.io-client";
import { EOIStreamInfo } from "../API/elements/eoiStreamInfo";
import { EOIVideoDetection } from "../API/elements/eoiVideoDetection";
import { EOISocketRooms } from "./eoiSocketRooms";
import {
    EOICountData,
    EOICountUpdateHandler,
    EOICountUpdateMessage,
    EOILiveSearchDetectionHandler,
    EOILiveSearchDetectionMessage,
    EOIPerformanceUpdateHandler,
    EOIPerformanceUpdateMessage,
    EOISocketClientOptions,
    EOISocketConnectHandler,
    EOISocketDisconnectHandler,
    EOISocketEventHandlers,
    EOIStreamDetectionHandler,
    EOIStreamDetectionMessage,
    EOIStreamUpdateHandler,
    EOIStreamUpdateMessage,
    EOIVideoProcessingUpdate,
    EOIVideoProcessingUpdateHandler,
    EOIVideoProcessingUpdateMessage,
} from "./eoiSocketTypes";

type ServerEventName =
    | "stream_update"
    | "stream_detection"
    | "performance_update"
    | "live_search_detection"
    | "count_update"
    | "video_processing_update";

type ClientEventName = "subscribe" | "unsubscribe";

export class EOISocketClient {
    private readonly socket: Socket;
    private readonly joinedRooms: Set<string> = new Set<string>();
    private readonly clientId?: string;

    private connectHandler?: EOISocketConnectHandler;
    private disconnectHandler?: EOISocketDisconnectHandler;
    private streamUpdateHandler?: EOIStreamUpdateHandler;
    private streamDetectionHandler?: EOIStreamDetectionHandler;
    private performanceUpdateHandler?: EOIPerformanceUpdateHandler;
    private liveSearchDetectionHandler?: EOILiveSearchDetectionHandler;
    private countUpdateHandler?: EOICountUpdateHandler;
    private videoProcessingUpdateHandler?: EOIVideoProcessingUpdateHandler;
    private connectPromise: Promise<void> | null = null;

    constructor(private readonly options: EOISocketClientOptions) {
        this.clientId = this.options.useClientIdQueryParam === false
            ? undefined
            : this.options.clientId ?? EOISocketClient.createClientId();

        const socketOptions = this.options.socketOptions ?? {};

        this.socket = io(this.options.apiBaseUrl, {
            autoConnect: false,
            path: this.options.path ?? "/websocket",
            ...socketOptions,
            query: this.buildQuery(socketOptions.query),
        });

        this.setHandlers(this.options.handlers ?? null);
        this.joinRooms(this.options.autoJoinRooms ?? []);
        this.registerInternalListeners();
    }

    public async connect(): Promise<void> {
        if (this.socket.connected) {
            return;
        }

        if (this.connectPromise != null) {
            return this.connectPromise;
        }

        this.connectPromise = new Promise<void>((resolve, reject) => {
            const handleConnect = () => {
                cleanup();
                this.connectPromise = null;
                resolve();
            };

            const handleConnectError = (error: Error) => {
                cleanup();
                this.connectPromise = null;
                reject(error);
            };

            const cleanup = () => {
                this.socket.off("connect", handleConnect);
                this.socket.off("connect_error", handleConnectError);
            };

            this.socket.once("connect", handleConnect);
            this.socket.once("connect_error", handleConnectError);
            this.socket.connect();
        });

        return this.connectPromise;
    }

    public onceConnect(handler: EOISocketConnectHandler): void {
        this.socket.once("connect", handler);
    }

    public onDisconnect(handler: EOISocketDisconnectHandler): void {
        this.socket.on("disconnect", handler);
    }

    public disconnect(): void {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }

    public isConnected(): boolean {
        return this.socket.connected;
    }

    public getClientId(): string | undefined {
        return this.clientId;
    }

    public setHandlers(handlers: EOISocketEventHandlers | null): void {
        this.setConnectHandler(handlers?.handleConnect?.bind(handlers) ?? null);
        this.setDisconnectHandler(handlers?.handleDisconnect?.bind(handlers) ?? null);
        this.setStreamUpdateHandler(handlers?.handleStreamUpdate?.bind(handlers) ?? null);
        this.setStreamDetectionHandler(handlers?.handleStreamDetection?.bind(handlers) ?? null);
        this.setPerformanceUpdateHandler(handlers?.handlePerformanceUpdate?.bind(handlers) ?? null);
        this.setLiveSearchDetectionHandler(handlers?.handleLiveSearchDetection?.bind(handlers) ?? null);
        this.setCountUpdateHandler(handlers?.handleCountUpdate?.bind(handlers) ?? null);
        this.setVideoProcessingUpdateHandler(handlers?.handleVideoProcessingUpdate?.bind(handlers) ?? null);
    }

    public setConnectHandler(handler: EOISocketConnectHandler | null): void {
        this.connectHandler = handler ?? undefined;
    }

    public setDisconnectHandler(handler: EOISocketDisconnectHandler | null): void {
        this.disconnectHandler = handler ?? undefined;
    }

    public setStreamUpdateHandler(handler: EOIStreamUpdateHandler | null): void {
        this.streamUpdateHandler = handler ?? undefined;
    }

    public setStreamDetectionHandler(handler: EOIStreamDetectionHandler | null): void {
        this.streamDetectionHandler = handler ?? undefined;
    }

    public setPerformanceUpdateHandler(handler: EOIPerformanceUpdateHandler | null): void {
        this.performanceUpdateHandler = handler ?? undefined;
    }

    public setLiveSearchDetectionHandler(handler: EOILiveSearchDetectionHandler | null): void {
        this.liveSearchDetectionHandler = handler ?? undefined;
    }

    public setCountUpdateHandler(handler: EOICountUpdateHandler | null): void {
        this.countUpdateHandler = handler ?? undefined;
    }

    public setVideoProcessingUpdateHandler(handler: EOIVideoProcessingUpdateHandler | null): void {
        this.videoProcessingUpdateHandler = handler ?? undefined;
    }

    public joinRoom(room: string): void {
        if (room == null || room.length === 0) {
            return;
        }

        this.joinedRooms.add(room);

        if (this.socket.connected) {
            this.emit("subscribe", room);
        }
    }

    public joinRooms(rooms: Iterable<string>): void {
        for (const room of rooms) {
            this.joinRoom(room);
        }
    }

    public leaveRoom(room: string): void {
        if (room == null || room.length === 0) {
            return;
        }

        this.joinedRooms.delete(room);

        if (this.socket.connected) {
            this.emit("unsubscribe", room);
        }
    }

    public joinLiveSearchDetections(searchId: string | number): string {
        const room = EOISocketRooms.liveSearchDetectionsForSearch(searchId);
        this.joinRoom(room);

        return room;
    }

    private registerInternalListeners(): void {
        this.socket.on("connect", () => {
            this.rejoinRooms();
            this.connectHandler?.();
        });

        this.socket.on("disconnect", (reason: string) => {
            this.disconnectHandler?.(reason);
        });

        this.onServerEvent("stream_update", (room, payload) => {
            this.streamUpdateHandler?.({
                room,
                streamInfos: this.parseStreamInfos(payload),
                rawPayload: payload,
            });
        });

        this.onServerEvent("stream_detection", (room, payload) => {
            this.streamDetectionHandler?.({
                room,
                detections: this.parseDetections(payload),
                image: this.getImage(payload),
                rawPayload: payload,
            });
        });

        this.onServerEvent("performance_update", (room, payload) => {
            this.performanceUpdateHandler?.({
                room,
                data: payload,
                rawPayload: payload,
            });
        });

        this.onServerEvent("live_search_detection", (room, payload) => {
            this.liveSearchDetectionHandler?.({
                room,
                detections: this.parseDetections(payload),
                image: this.getImage(payload),
                rawPayload: payload,
            });
        });

        this.onServerEvent("count_update", (room, payload) => {
            this.countUpdateHandler?.({
                room,
                count: this.parseCountData(payload),
                rawPayload: payload,
            });
        });

        this.onServerEvent("video_processing_update", (room, payload) => {
            const { updates, isSnapshot } = this.parseVideoProcessingUpdate(payload);

            this.videoProcessingUpdateHandler?.({
                room,
                updates,
                isSnapshot,
                rawPayload: payload,
            });
        });
    }

    private onServerEvent(event: ServerEventName, handler: (room: string | undefined, payload: unknown) => void): void {
        (this.socket as any).on(event, (...args: unknown[]) => {
            const { room, payload } = this.extractRoomAndPayload(args);
            handler(room, payload);
        });
    }

    private emit(event: ClientEventName, room: string): void {
        this.socket.emit(event, room);
    }

    private rejoinRooms(): void {
        for (const room of this.joinedRooms) {
            this.emit("subscribe", room);
        }
    }

    private buildQuery(query: unknown): Record<string, string> | Record<string, unknown> | undefined {
        if (typeof query === "string") {
            const parsedQuery: Record<string, string> = {};
            const searchParams = new URLSearchParams(query);

            searchParams.forEach((value, key) => {
                parsedQuery[key] = value;
            });

            if (this.clientId == null) {
                return parsedQuery;
            }

            return {
                ...parsedQuery,
                client_id: this.clientId,
            };
        }

        if (query != null && typeof query === "object") {
            if (this.clientId == null) {
                return query as Record<string, unknown>;
            }

            return {
                ...(query as Record<string, unknown>),
                client_id: this.clientId,
            };
        }

        if (this.clientId == null) {
            return undefined;
        }

        return { client_id: this.clientId };
    }

    private extractRoomAndPayload(args: unknown[]): { room?: string; payload: unknown } {
        if (args.length >= 2 && typeof args[0] === "string") {
            return {
                room: args[0],
                payload: args[1],
            };
        }

        return {
            payload: args.length > 0 ? args[0] : undefined,
        };
    }

    private parseStreamInfos(payload: unknown): EOIStreamInfo[] {
        const streamInfoObjects = Array.isArray(payload)
            ? payload
            : this.getArrayField(payload, "streams");

        return streamInfoObjects
            .map((streamInfo) => EOIStreamInfo.fromJsonObj(streamInfo))
            .filter((streamInfo): streamInfo is EOIStreamInfo => streamInfo != null);
    }

    private parseDetections(payload: unknown): EOIVideoDetection[] {
        const detectionObjects = this.getArrayField(payload, "detections");

        return detectionObjects
            .map((detection) => EOIVideoDetection.fromJsonObj(detection))
            .filter((detection): detection is EOIVideoDetection => detection != null);
    }

    private getImage(payload: unknown): string | null | undefined {
        const payloadObject = this.asObject(payload);

        return typeof payloadObject?.image === "string" || payloadObject?.image == null
            ? (payloadObject?.image as string | null | undefined)
            : undefined;
    }

    private parseCountData(payload: unknown): EOICountData | null {
        const payloadObject = this.asObject(payload);
        const nestedCount = this.asObject(payloadObject?.count);

        if (nestedCount != null) {
            return nestedCount as EOICountData;
        }

        if (payloadObject != null) {
            return payloadObject as EOICountData;
        }

        return null;
    }

    private parseVideoProcessingUpdate(payload: unknown): { updates: EOIVideoProcessingUpdate[]; isSnapshot: boolean } {
        const isSnapshot = Array.isArray(payload);
        const rawUpdates = isSnapshot ? payload : [payload];

        return {
            updates: rawUpdates.filter((update): update is EOIVideoProcessingUpdate => this.asObject(update) != null),
            isSnapshot,
        };
    }

    private getArrayField(payload: unknown, key: string): unknown[] {
        const payloadObject = this.asObject(payload);
        const value = payloadObject?.[key];

        return Array.isArray(value) ? value : [];
    }

    private asObject(value: unknown): Record<string, unknown> | null {
        if (value != null && typeof value === "object" && !Array.isArray(value)) {
            return value as Record<string, unknown>;
        }

        return null;
    }

    private static createClientId(): string {
        const cryptoObject = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;

        if (typeof cryptoObject?.randomUUID === "function") {
            return cryptoObject.randomUUID();
        }

        return `eoi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    }
}
