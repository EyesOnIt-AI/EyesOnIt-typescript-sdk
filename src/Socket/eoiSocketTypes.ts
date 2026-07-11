import type { ManagerOptions, SocketOptions } from "socket.io-client";
import { EOIVideoDetection } from "../API/elements/eoiVideoDetection";
import { EOIModelOptimizationStatusData } from "../API/outputs/eoiModelOptimizationStatusResponse";

export type EOIVideoId = string | number;

export interface EOIVideoProcessingUpdate {
    video_id: EOIVideoId;
    input_video_path?: string | null;
    input_video_name?: string | null;
    length?: number | null;
    current_processing_time?: number | null;
    percent_complete?: number | null;
}

export interface EOICountData {
    stream_name?: string | null;
    region_name?: string | null;
    object_type?: string | null;
    frame_number?: number | null;
    time?: number | string | null;
    count?: number | null;
    [key: string]: unknown;
}

export interface EOISocketGenetecNotificationData {
    webhook_event_id?: number | null;
    webhook_camera_uuid?: string | null;
}

export interface EOISocketNotificationData {
    phone_number?: string | null;
    genetec?: EOISocketGenetecNotificationData | null;
    rest_url?: string | null;
    include_image?: boolean | null;
    include_count?: boolean | null;
}

export interface EOILiveSearchUpdateSimilarityImageData {
    seed_id?: number | null;
    alert?: boolean | null;
    threshold?: number | null;
}

export interface EOILiveSearchUpdateSimilarityData {
    images?: EOILiveSearchUpdateSimilarityImageData[] | null;
}

export interface EOILiveSearchUpdateData {
    search_id: number;
    search_type?: string | null;
    class_name?: string | null;
    object_description?: string | null;
    face_match_type?: string | null;
    face_person_id?: string | null;
    face_group_id?: string | null;
    similarity?: EOILiveSearchUpdateSimilarityData | null;
    alert_threshold?: number | null;
    stream_ids?: string[] | null;
    track_alert_cooldown_seconds?: number | null;
    start_time?: string | Date | null;
    end_time?: string | Date | null;
    active?: boolean | null;
    notification?: EOISocketNotificationData | null;
    [key: string]: unknown;
}

export type EOISocketEnvelopeMessageType = "snapshot" | "delta";

export interface EOISocketEnvelopeBase {
    schema_version: number;
    server_instance_id: string;
    room: string;
    message_type: EOISocketEnvelopeMessageType;
    sequence: number;
    sent_at: string;
}

export interface EOISocketStreamInfo {
    stream_id?: string | null;
    stream_url?: string | null;
    name?: string | null;
    status?: string | null;
}

export interface EOIStreamUpsertChange {
    op: "upsert";
    stream: EOISocketStreamInfo;
}

export interface EOIStreamDeleteChange {
    op: "delete";
    stream_id?: string | null;
    stream_url?: string | null;
}

export type EOIStreamChange = EOIStreamUpsertChange | EOIStreamDeleteChange;

export interface EOIStreamSnapshotEnvelope extends EOISocketEnvelopeBase {
    message_type: "snapshot";
    streams: EOISocketStreamInfo[];
}

export interface EOIStreamDeltaEnvelope extends EOISocketEnvelopeBase {
    message_type: "delta";
    changes: EOIStreamChange[];
}

export type EOIStreamUpdateMessage = EOIStreamSnapshotEnvelope | EOIStreamDeltaEnvelope;

export interface EOILiveSearchUpsertChange {
    op: "upsert";
    live_search: EOILiveSearchUpdateData;
}

export interface EOILiveSearchDeleteChange {
    op: "delete";
    search_id: number;
}

export type EOILiveSearchChange = EOILiveSearchUpsertChange | EOILiveSearchDeleteChange;

export interface EOILiveSearchSnapshotEnvelope extends EOISocketEnvelopeBase {
    message_type: "snapshot";
    live_searches: EOILiveSearchUpdateData[];
}

export interface EOILiveSearchDeltaEnvelope extends EOISocketEnvelopeBase {
    message_type: "delta";
    changes: EOILiveSearchChange[];
}

export type EOILiveSearchUpdateMessage = EOILiveSearchSnapshotEnvelope | EOILiveSearchDeltaEnvelope;

export interface EOIDetectionMessage {
    room?: string;
    detections: EOIVideoDetection[];
    image?: string | null;
    rawPayload: unknown;
}

export interface EOIStreamDetectionMessage extends EOIDetectionMessage {
}

export interface EOILiveSearchDetectionMessage extends EOIDetectionMessage {
}

export interface EOIPerformanceGpuUpdate {
    index: number;
    util_pct?: number | null;
    vram_pct?: number | null;
}

export interface EOIPerformanceSystemUpdate {
    cpu_pct?: number | null;
    ram_pct?: number | null;
}

export interface EOIPerformanceUpdateMessage {
    schema_version: number;
    server_instance_id: string;
    sequence: number;
    sent_at: string;
    gpus: EOIPerformanceGpuUpdate[];
    system: EOIPerformanceSystemUpdate;
}

export interface EOICountUpdateMessage {
    room?: string;
    count: EOICountData | null;
    rawPayload: unknown;
}

export interface EOIVideoProcessingUpdateMessage {
    room?: string;
    updates: EOIVideoProcessingUpdate[];
    isSnapshot: boolean;
    rawPayload: unknown;
}

export interface EOISubscriptionMessage {
    room?: string;
    rawPayload: unknown;
}

export interface EOISubscriptionErrorMessage extends EOISubscriptionMessage {
    message?: string;
}

/** Server-pushed startup readiness update, sent on every Socket.IO connection and state change. */
export type EOIModelOptimizationStatusMessage = EOIModelOptimizationStatusData;

export type EOISocketConnectHandler = () => void;
export type EOISocketDisconnectHandler = (reason: string) => void;
export type EOIStreamUpdateHandler = (message: EOIStreamUpdateMessage) => void;
export type EOIStreamDetectionHandler = (message: EOIStreamDetectionMessage) => void;
export type EOIPerformanceUpdateHandler = (message: EOIPerformanceUpdateMessage) => void;
export type EOILiveSearchUpdateHandler = (message: EOILiveSearchUpdateMessage) => void;
export type EOILiveSearchDetectionHandler = (message: EOILiveSearchDetectionMessage) => void;
export type EOICountUpdateHandler = (message: EOICountUpdateMessage) => void;
export type EOIVideoProcessingUpdateHandler = (message: EOIVideoProcessingUpdateMessage) => void;
export type EOISubscriptionHandler = (message: EOISubscriptionMessage) => void;
export type EOISubscriptionErrorHandler = (message: EOISubscriptionErrorMessage) => void;
export type EOIModelOptimizationStatusHandler = (message: EOIModelOptimizationStatusMessage) => void;

export interface EOISocketEventHandlers {
    handleConnect?(): void;
    handleDisconnect?(reason: string): void;
    handleStreamUpdate?(message: EOIStreamUpdateMessage): void;
    handleStreamDetection?(message: EOIStreamDetectionMessage): void;
    handlePerformanceUpdate?(message: EOIPerformanceUpdateMessage): void;
    handleLiveSearchUpdate?(message: EOILiveSearchUpdateMessage): void;
    handleLiveSearchDetection?(message: EOILiveSearchDetectionMessage): void;
    handleCountUpdate?(message: EOICountUpdateMessage): void;
    handleVideoProcessingUpdate?(message: EOIVideoProcessingUpdateMessage): void;
    handleSubscribed?(message: EOISubscriptionMessage): void;
    handleUnsubscribed?(message: EOISubscriptionMessage): void;
    handleSubscriptionError?(message: EOISubscriptionErrorMessage): void;
    handleModelOptimizationStatus?(message: EOIModelOptimizationStatusMessage): void;
}

export interface EOISocketClientOptions {
    apiBaseUrl: string;
    path?: string;
    clientId?: string;
    useClientIdQueryParam?: boolean;
    autoJoinRooms?: string[];
    handlers?: EOISocketEventHandlers;
    socketOptions?: Partial<ManagerOptions & SocketOptions>;
}
