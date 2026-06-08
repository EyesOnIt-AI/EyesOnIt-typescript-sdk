import type { ManagerOptions, SocketOptions } from "socket.io-client";
import { EOIStreamInfo } from "../API/elements/eoiStreamInfo";
import { EOIVideoDetection } from "../API/elements/eoiVideoDetection";

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
    image?: string | null;
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
    track_alert_cooldown_seconds?: number | null;
    start_time?: string | Date | null;
    end_time?: string | Date | null;
    active?: boolean | null;
    notification?: EOISocketNotificationData | null;
    [key: string]: unknown;
}

export interface EOIStreamUpdateMessage {
    room?: string;
    streamInfos: EOIStreamInfo[];
    rawPayload: unknown;
}

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

export interface EOIPerformanceUpdateMessage<T = unknown> {
    room?: string;
    data: T;
    rawPayload: T;
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

export interface EOILiveSearchUpdateMessage {
    room?: string;
    updates: EOILiveSearchUpdateData[];
    rawPayload: unknown;
}

export interface EOISubscriptionMessage {
    room?: string;
    rawPayload: unknown;
}

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
