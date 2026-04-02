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
    frame_number?: number | null;
    time?: number | string | null;
    count?: number | null;
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

export type EOISocketConnectHandler = () => void;
export type EOISocketDisconnectHandler = (reason: string) => void;
export type EOIStreamUpdateHandler = (message: EOIStreamUpdateMessage) => void;
export type EOIStreamDetectionHandler = (message: EOIStreamDetectionMessage) => void;
export type EOIPerformanceUpdateHandler = (message: EOIPerformanceUpdateMessage) => void;
export type EOILiveSearchDetectionHandler = (message: EOILiveSearchDetectionMessage) => void;
export type EOICountUpdateHandler = (message: EOICountUpdateMessage) => void;
export type EOIVideoProcessingUpdateHandler = (message: EOIVideoProcessingUpdateMessage) => void;

export interface EOISocketEventHandlers {
    handleConnect?(): void;
    handleDisconnect?(reason: string): void;
    handleStreamUpdate?(message: EOIStreamUpdateMessage): void;
    handleStreamDetection?(message: EOIStreamDetectionMessage): void;
    handlePerformanceUpdate?(message: EOIPerformanceUpdateMessage): void;
    handleLiveSearchDetection?(message: EOILiveSearchDetectionMessage): void;
    handleCountUpdate?(message: EOICountUpdateMessage): void;
    handleVideoProcessingUpdate?(message: EOIVideoProcessingUpdateMessage): void;
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
