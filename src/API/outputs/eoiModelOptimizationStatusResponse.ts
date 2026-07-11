import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

export type EOIModelOptimizationState = "pending" | "running" | "ready" | "failed";

export interface EOIModelOptimizationCurrentModel {
    id: string;
    label: string;
    gpu_id: number;
    stage: string;
}

export interface EOIModelOptimizationFailure {
    message: string;
    model_id?: string | null;
    model_label?: string | null;
    gpu_id?: number | null;
}

/** The shared REST and Socket.IO model-optimization status payload. */
export interface EOIModelOptimizationStatusData {
    state?: EOIModelOptimizationState;
    completed_models?: number;
    total_models?: number;
    current_model?: EOIModelOptimizationCurrentModel | null;
    failure?: EOIModelOptimizationFailure | null;
    started_unix?: number | null;
    updated_unix?: number | null;
    completed_unix?: number | null;
}

/** Typed payload returned by the model optimization status endpoints. */
export class EOIModelOptimizationStatusResponse extends EOIBaseOutputs {
    public data: any;
    public state?: EOIModelOptimizationState;
    public completed_models: number = 0;
    public total_models: number = 0;
    public current_model?: EOIModelOptimizationCurrentModel | null;
    public failure?: EOIModelOptimizationFailure | null;
    public started_unix?: number | null;
    public updated_unix?: number | null;
    public completed_unix?: number | null;

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        this.data = eoiResponse.data;
        const data = eoiResponse.data || {};
        this.state = data.state;
        this.completed_models = Number.isFinite(data.completed_models) ? Number(data.completed_models) : 0;
        this.total_models = Number.isFinite(data.total_models) ? Number(data.total_models) : 0;
        this.current_model = data.current_model || null;
        this.failure = data.failure || null;
        this.started_unix = data.started_unix ?? null;
        this.updated_unix = data.updated_unix ?? null;
        this.completed_unix = data.completed_unix ?? null;
    }

    /** Maps a server-pushed Socket.IO payload to the same typed status shape. */
    public static fromStatusData(data: EOIModelOptimizationStatusData): EOIModelOptimizationStatusResponse {
        const response = EOIResponse.success();
        response.data = data;
        return new EOIModelOptimizationStatusResponse(response);
    }
}
