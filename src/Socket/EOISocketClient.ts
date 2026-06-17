import { io, Socket } from "socket.io-client";
import { EOIVideoDetection } from "../API/elements/eoiVideoDetection";
import { EOISocketRoomNames, EOISocketRooms } from "./eoiSocketRooms";
import {
    EOICountData,
    EOICountUpdateHandler,
    EOICountUpdateMessage,
    EOILiveSearchChange,
    EOILiveSearchDetectionHandler,
    EOILiveSearchDetectionMessage,
    EOILiveSearchUpdateData,
    EOILiveSearchUpdateHandler,
    EOILiveSearchUpdateMessage,
    EOIPerformanceUpdateHandler,
    EOIPerformanceUpdateMessage,
    EOISocketClientOptions,
    EOISocketConnectHandler,
    EOISocketDisconnectHandler,
    EOISocketEventHandlers,
    EOISocketStreamInfo,
    EOISubscriptionErrorHandler,
    EOISubscriptionErrorMessage,
    EOISubscriptionHandler,
    EOIStreamDetectionHandler,
    EOIStreamDetectionMessage,
    EOIStreamChange,
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
    | "live_search_update"
    | "live_search_detection"
    | "count_update"
    | "video_processing_update"
    | "subscribed"
    | "unsubscribed"
    | "subscription_error";

type ClientEventName = "subscribe" | "unsubscribe" | "request_snapshot";

export class EOISocketClient {
    private readonly socket: Socket;
    private readonly joinedRooms: Set<string> = new Set<string>();
    private readonly clientId?: string;

    private connectHandler?: EOISocketConnectHandler;
    private disconnectHandler?: EOISocketDisconnectHandler;
    private streamUpdateHandler?: EOIStreamUpdateHandler;
    private streamDetectionHandler?: EOIStreamDetectionHandler;
    private performanceUpdateHandler?: EOIPerformanceUpdateHandler;
    private liveSearchUpdateHandler?: EOILiveSearchUpdateHandler;
    private liveSearchDetectionHandler?: EOILiveSearchDetectionHandler;
    private countUpdateHandler?: EOICountUpdateHandler;
    private videoProcessingUpdateHandler?: EOIVideoProcessingUpdateHandler;
    private subscribedHandler?: EOISubscriptionHandler;
    private unsubscribedHandler?: EOISubscriptionHandler;
    private subscriptionErrorHandler?: EOISubscriptionErrorHandler;
    private connectPromise: Promise<void> | null = null;
    private readonly lastSequenceByRoom: Map<string, number> = new Map<string, number>();
    private readonly serverInstanceIdByRoom: Map<string, string> = new Map<string, string>();

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
        this.setLiveSearchUpdateHandler(handlers?.handleLiveSearchUpdate?.bind(handlers) ?? null);
        this.setLiveSearchDetectionHandler(handlers?.handleLiveSearchDetection?.bind(handlers) ?? null);
        this.setCountUpdateHandler(handlers?.handleCountUpdate?.bind(handlers) ?? null);
        this.setVideoProcessingUpdateHandler(handlers?.handleVideoProcessingUpdate?.bind(handlers) ?? null);
        this.setSubscribedHandler(handlers?.handleSubscribed?.bind(handlers) ?? null);
        this.setUnsubscribedHandler(handlers?.handleUnsubscribed?.bind(handlers) ?? null);
        this.setSubscriptionErrorHandler(handlers?.handleSubscriptionError?.bind(handlers) ?? null);
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

    public setLiveSearchUpdateHandler(handler: EOILiveSearchUpdateHandler | null): void {
        this.liveSearchUpdateHandler = handler ?? undefined;
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

    public setSubscribedHandler(handler: EOISubscriptionHandler | null): void {
        this.subscribedHandler = handler ?? undefined;
    }

    public setUnsubscribedHandler(handler: EOISubscriptionHandler | null): void {
        this.unsubscribedHandler = handler ?? undefined;
    }

    public setSubscriptionErrorHandler(handler: EOISubscriptionErrorHandler | null): void {
        this.subscriptionErrorHandler = handler ?? undefined;
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

    public requestSnapshot(room: string): void {
        if (room == null || room.length === 0 || !this.socket.connected) {
            return;
        }

        this.emit("request_snapshot", room);
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
            const message = this.parseStreamUpdateEnvelope(payload);
            if (message == null || !this.trackSequence(message.room ?? room, message)) {
                return;
            }

            this.streamUpdateHandler?.(message);
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
            const message = this.parsePerformanceUpdate(payload);
            const performanceRoom = room ?? EOISocketRoomNames.allPerformanceUpdates;
            if (message == null || !this.trackSequence(performanceRoom, message)) {
                return;
            }

            this.performanceUpdateHandler?.(message);
        });

        this.onServerEvent("live_search_update", (room, payload) => {
            const message = this.parseLiveSearchUpdateEnvelope(payload);
            if (message == null || !this.trackSequence(message.room ?? room, message)) {
                return;
            }

            this.liveSearchUpdateHandler?.(message);
        });

        this.onServerEvent("live_search_detection", (room, payload) => {
            this.liveSearchDetectionHandler?.({
                room,
                detections: this.parseDetections(payload),
                image: this.getImage(payload),
                rawPayload: payload,
            });
        });

        this.onServerEvent("subscribed", (room, payload) => {
            this.subscribedHandler?.({
                room: this.getSubscriptionRoom(payload) ?? room,
                rawPayload: payload,
            });
        });

        this.onServerEvent("unsubscribed", (room, payload) => {
            this.unsubscribedHandler?.({
                room: this.getSubscriptionRoom(payload) ?? room,
                rawPayload: payload,
            });
        });

        this.onServerEvent("subscription_error", (room, payload) => {
            this.subscriptionErrorHandler?.(this.parseSubscriptionError(payload, room));
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
        this.socket.emit(event, { room });
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

    private parseStreamUpdateEnvelope(payload: unknown): EOIStreamUpdateMessage | null {
        const payloadObject = this.asObject(payload);
        const base = this.parseSequencedBase(payloadObject, true);
        if (base == null) {
            return null;
        }
        const room = base.room;
        if (room == null || base.message_type == null) {
            return null;
        }

        if (base.message_type === "snapshot") {
            return {
                ...base,
                room,
                message_type: "snapshot",
                streams: this.getArrayField(payloadObject, "streams")
                    .filter((stream): stream is EOISocketStreamInfo => this.asObject(stream) != null),
            };
        }

        if (base.message_type === "delta") {
            return {
                ...base,
                room,
                message_type: "delta",
                changes: this.getArrayField(payloadObject, "changes")
                    .map((change) => this.parseStreamChange(change))
                    .filter((change): change is EOIStreamChange => change != null),
            };
        }

        return null;
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

    private parseLiveSearchUpdateEnvelope(payload: unknown): EOILiveSearchUpdateMessage | null {
        const payloadObject = this.asObject(payload);
        const base = this.parseSequencedBase(payloadObject, true);
        if (base == null) {
            return null;
        }
        const room = base.room;
        if (room == null || base.message_type == null) {
            return null;
        }

        if (base.message_type === "snapshot") {
            return {
                ...base,
                room,
                message_type: "snapshot",
                live_searches: this.getArrayField(payloadObject, "live_searches")
                    .filter((update): update is EOILiveSearchUpdateData => this.asObject(update) != null),
            };
        }

        if (base.message_type === "delta") {
            return {
                ...base,
                room,
                message_type: "delta",
                changes: this.getArrayField(payloadObject, "changes")
                    .map((change) => this.parseLiveSearchChange(change))
                    .filter((change): change is EOILiveSearchChange => change != null),
            };
        }

        return null;
    }

    private parsePerformanceUpdate(payload: unknown): EOIPerformanceUpdateMessage | null {
        const payloadObject = this.asObject(payload);
        const base = this.parseSequencedBase(payloadObject, false);
        if (base == null) {
            return null;
        }

        const systemObject = this.asObject(payloadObject?.system);

        return {
            schema_version: base.schema_version,
            server_instance_id: base.server_instance_id,
            sequence: base.sequence,
            sent_at: base.sent_at,
            gpus: this.getArrayField(payloadObject, "gpus")
                .map((gpu) => this.asObject(gpu))
                .filter((gpu): gpu is Record<string, unknown> => gpu != null)
                .map((gpu) => ({
                    index: Number(gpu.index),
                    util_pct: this.toNullableNumber(gpu.util_pct),
                    vram_pct: this.toNullableNumber(gpu.vram_pct),
                }))
                .filter((gpu) => Number.isFinite(gpu.index)),
            system: {
                cpu_pct: this.toNullableNumber(systemObject?.cpu_pct),
                ram_pct: this.toNullableNumber(systemObject?.ram_pct),
            },
        };
    }

    private parseSequencedBase(payloadObject: Record<string, unknown> | null, requireMessageType: boolean): {
        schema_version: number;
        server_instance_id: string;
        sequence: number;
        sent_at: string;
        room?: string;
        message_type?: "snapshot" | "delta";
    } | null {
        if (payloadObject == null) {
            return null;
        }

        const schemaVersion = Number(payloadObject.schema_version);
        const serverInstanceId = typeof payloadObject.server_instance_id === "string"
            ? payloadObject.server_instance_id
            : "";
        const sequence = Number(payloadObject.sequence);
        const sentAt = typeof payloadObject.sent_at === "string"
            ? payloadObject.sent_at
            : "";
        const room = typeof payloadObject.room === "string"
            ? payloadObject.room
            : undefined;
        const messageType = payloadObject.message_type === "snapshot" || payloadObject.message_type === "delta"
            ? payloadObject.message_type
            : undefined;

        if (!Number.isFinite(schemaVersion) || serverInstanceId.length === 0 || !Number.isFinite(sequence) || sentAt.length === 0) {
            return null;
        }

        if (requireMessageType && (room == null || messageType == null)) {
            return null;
        }

        return {
            schema_version: schemaVersion,
            server_instance_id: serverInstanceId,
            room,
            message_type: messageType,
            sequence,
            sent_at: sentAt,
        };
    }

    private parseStreamChange(change: unknown): EOIStreamChange | null {
        const changeObject = this.asObject(change);
        if (changeObject?.op === "upsert") {
            const stream = this.asObject(changeObject.stream);
            return stream == null ? null : { op: "upsert", stream: stream as EOISocketStreamInfo };
        }

        if (changeObject?.op === "delete") {
            return {
                op: "delete",
                stream_id: this.toNullableString(changeObject.stream_id),
                stream_url: this.toNullableString(changeObject.stream_url),
            };
        }

        return null;
    }

    private parseLiveSearchChange(change: unknown): EOILiveSearchChange | null {
        const changeObject = this.asObject(change);
        if (changeObject?.op === "upsert") {
            const liveSearch = this.asObject(changeObject.live_search);
            return liveSearch == null
                ? null
                : { op: "upsert", live_search: liveSearch as EOILiveSearchUpdateData };
        }

        if (changeObject?.op === "delete") {
            const searchId = Number(changeObject.search_id);
            return Number.isFinite(searchId) ? { op: "delete", search_id: searchId } : null;
        }

        return null;
    }

    private trackSequence(
        room: string | undefined,
        message: { server_instance_id: string; sequence: number; message_type?: string },
    ): boolean {
        if (room == null || room.length === 0 || !Number.isFinite(message.sequence)) {
            return true;
        }

        const previousServerInstanceId = this.serverInstanceIdByRoom.get(room);
        if (previousServerInstanceId !== message.server_instance_id) {
            this.serverInstanceIdByRoom.set(room, message.server_instance_id);
            this.lastSequenceByRoom.set(room, message.sequence);
            return true;
        }

        const previousSequence = this.lastSequenceByRoom.get(room);
        if (previousSequence != null && message.sequence <= previousSequence) {
            return false;
        }

        if (
            previousSequence != null
            && message.sequence > previousSequence + 1
            && message.message_type !== "snapshot"
        ) {
            this.requestSnapshot(room);
        }

        this.lastSequenceByRoom.set(room, message.sequence);
        return true;
    }

    private getSubscriptionRoom(payload: unknown): string | undefined {
        const payloadObject = this.asObject(payload);

        return typeof payloadObject?.room === "string"
            ? payloadObject.room
            : undefined;
    }

    private parseSubscriptionError(payload: unknown, room: string | undefined): EOISubscriptionErrorMessage {
        const payloadObject = this.asObject(payload);

        return {
            room: this.getSubscriptionRoom(payload) ?? room,
            message: typeof payloadObject?.message === "string" ? payloadObject.message : undefined,
            rawPayload: payload,
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

    private toNullableNumber(value: unknown): number | null {
        if (value == null) {
            return null;
        }

        const numberValue = Number(value);
        return Number.isFinite(numberValue) ? numberValue : null;
    }

    private toNullableString(value: unknown): string | null {
        if (value == null) {
            return null;
        }

        return typeof value === "string" ? value : String(value);
    }

    private static createClientId(): string {
        const cryptoObject = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;

        if (typeof cryptoObject?.randomUUID === "function") {
            return cryptoObject.randomUUID();
        }

        return `eoi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    }
}
