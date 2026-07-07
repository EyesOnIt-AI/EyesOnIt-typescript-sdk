import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { EOIResponse } from "../eoiResponse";
import { EOIRESTRequestBody, EOIRESTRequestHeaders, IEOIRESTHandler } from "./IEOIRESTHandler";
import { EOILogger, Logger } from "../../utils/logger";

export type { EOILogger } from "../../utils/logger";

export interface EOIAxiosRESTHandlerOptions {
    timeoutMs?: number;
    maxAttempts?: number;
}

type EOIAxiosResponseBody = {
    success: boolean;
    message?: string;
    data?: unknown;
} | string;

export class EOIAxiosRESTHandler implements IEOIRESTHandler {
    private static readonly defaultMaxAttempts = 2;

    private readonly logger: EOILogger;
    private readonly timeoutMs?: number;
    private readonly maxAttempts: number;

    constructor(customLogger?: EOILogger, options: EOIAxiosRESTHandlerOptions = {}) {
        this.logger = customLogger || new Logger();
        this.timeoutMs = options.timeoutMs != null && options.timeoutMs >= 0
            ? options.timeoutMs
            : undefined;
        this.maxAttempts = this.normalizeMaxAttempts(options.maxAttempts);
    }

    public async get(endPoint: string): Promise<EOIResponse> {
        return this.request("get", endPoint);
    }

    public async post(endPoint: string, body: EOIRESTRequestBody, headers: EOIRESTRequestHeaders): Promise<EOIResponse> {
        return this.request("post", endPoint, body, headers);
    }

    private async request(
        method: "get" | "post",
        endPoint: string,
        body?: EOIRESTRequestBody,
        headers?: EOIRESTRequestHeaders,
    ): Promise<EOIResponse> {
        for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
            try {
                const response = method === "get"
                    ? await axios.get<EOIAxiosResponseBody>(endPoint, this.buildRequestConfig())
                    : await axios.post<EOIAxiosResponseBody>(endPoint, body, this.buildRequestConfig(headers));

                return this.toEOIResponse(response);
            } catch (error: unknown) {
                if (attempt < this.maxAttempts && this.isRetryableError(error)) {
                    this.logger.warn(`EOIAxiosRESTHandler.${method}: retryable request failure on attempt ${attempt}; retrying. ${this.getErrorMessage(error)}`);
                    continue;
                }

                const errorDetails = this.formatAxiosError(error);
                this.logger.error(`EOIAxiosRESTHandler.${method} error: ${errorDetails}`);
                return new EOIResponse(false, this.getErrorMessage(error));
            }
        }

        return new EOIResponse(false, "Request failed after retries");
    }

    private buildRequestConfig(headers?: EOIRESTRequestHeaders): AxiosRequestConfig {
        const config: AxiosRequestConfig = {};

        if (headers != null) {
            config.headers = headers;
            if (headers.Accept === "text/csv") {
                config.responseType = "text";
            }
        }

        if (this.timeoutMs != null) {
            config.timeout = this.timeoutMs;
        }

        return config;
    }

    private toEOIResponse(response: AxiosResponse<EOIAxiosResponseBody>): EOIResponse {
        if (response.data == null) {
            return new EOIResponse(false, "Empty response");
        }

        if (typeof response.data === "string") {
            const eoiResponse = new EOIResponse(true);
            eoiResponse.data = { csv: response.data };
            return eoiResponse;
        }

        const eoiResponse = new EOIResponse(response.data.success, response.data.message);
        eoiResponse.data = response.data.data;

        return eoiResponse;
    }

    private normalizeMaxAttempts(maxAttempts: number | undefined): number {
        if (maxAttempts == null) {
            return EOIAxiosRESTHandler.defaultMaxAttempts;
        }

        return Number.isFinite(maxAttempts) && maxAttempts > 0
            ? Math.floor(maxAttempts)
            : 1;
    }

    private isRetryableError(error: unknown): boolean {
        if (axios.isAxiosError(error) && error.response != null) {
            return false;
        }

        const errorRecord = this.asErrorRecord(error);
        const code = typeof errorRecord?.code === "string" ? errorRecord.code : "";
        const message = this.getErrorMessage(error).toLowerCase();

        return code === "ECONNRESET" ||
            code === "ECONNREFUSED" ||
            code === "ECONNABORTED" ||
            code === "ETIMEDOUT" ||
            message.includes("connection was closed") ||
            message.includes("socket hang up") ||
            message.includes("connection closed") ||
            message.includes("timeout");
    }

    private formatAxiosError(error: unknown): string {
        if (axios.isAxiosError(error) && error.response?.data != null) {
            return JSON.stringify(error.response.data);
        }

        const errorRecord = this.asErrorRecord(error);
        return JSON.stringify({
            code: errorRecord?.code,
            message: this.getErrorMessage(error),
            url: this.getRequestUrl(error),
        });
    }

    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        const errorRecord = this.asErrorRecord(error);
        if (typeof errorRecord?.message === "string") {
            return errorRecord.message;
        }

        return "Unknown error";
    }

    private getRequestUrl(error: unknown): string | undefined {
        if (!axios.isAxiosError(error)) {
            return undefined;
        }

        return error.config?.url;
    }

    private asErrorRecord(error: unknown): Record<string, unknown> | null {
        return error != null && typeof error === "object"
            ? error as Record<string, unknown>
            : null;
    }
}
