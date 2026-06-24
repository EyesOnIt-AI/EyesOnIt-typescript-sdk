import axios from "axios";
import { EOIResponse } from "../eoiResponse";
import { IEOIRESTHandler } from "./IEOIRESTHandler";
import { Logger } from "../../utils/logger";

export class EOIAxiosRESTHandler implements IEOIRESTHandler {
    private logger;

    constructor(private customLogger?: any) {
        this.logger = this.customLogger || new Logger();
    }

    public async get(endPoint: string): Promise<EOIResponse> {
        let eoiResponse: EOIResponse | null = null;

        await axios.get(endPoint).then(async (response: any) => {
            eoiResponse = new EOIResponse(response.data.success, response.data.message);
            eoiResponse.data = response.data.data;
        }).catch(async (error: any) => {
            const errorDetails = this.formatAxiosError(error);
            this.logger.error(`EOIAxiosRESTHandler.get error: ${errorDetails}`);
            console.log(`EOIAxiosRESTHandler.get error: ${errorDetails}`);
            eoiResponse = new EOIResponse(false, error.message);
        });

        if (eoiResponse == null) {
            eoiResponse = new EOIResponse(false, "Unknown error");
        }

        return eoiResponse;
    }

    public async post(endPoint: string, body: string, headers: any): Promise<EOIResponse> {
        const maxAttempts = 2;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            let eoiResponse: EOIResponse | null = null;
            let staleConnection = false;

            await axios.post(endPoint, body, { headers: headers/*, timeout: 5000*/ }).then(async (response: any) => {
                eoiResponse = new EOIResponse(response.data.success, response.data.message);
                eoiResponse.data = response.data.data;
            }).catch(async (error: any) => {
                if (attempt < maxAttempts && this.isStaleConnectionError(error)) {
                    this.logger.warn(`EOIAxiosRESTHandler.post: stale keep-alive connection on attempt ${attempt}; retrying. ${error.message}`);
                    staleConnection = true;
                } else {
                    const errorDetails = this.formatAxiosError(error);
                    this.logger.error(`EOIAxiosRESTHandler.post error: ${errorDetails}`);
                    console.log(`EOIAxiosRESTHandler.post error: ${errorDetails}`);
                    eoiResponse = new EOIResponse(false, error.message);
                }
            });

            if (staleConnection) {
                continue;
            }

            if (eoiResponse == null) {
                eoiResponse = new EOIResponse(false, "Unknown error");
            }

            return eoiResponse;
        }

        return new EOIResponse(false, "Request failed after retries");
    }

    private isStaleConnectionError(error: any): boolean {
        const code: string = error?.code ?? '';
        const message: string = error?.message ?? '';
        return code === 'ECONNRESET' ||
            code === 'ECONNREFUSED' ||
            message.toLowerCase().includes('connection was closed') ||
            message.toLowerCase().includes('socket hang up') ||
            message.toLowerCase().includes('connection closed');
    }

    private formatAxiosError(error: any): string {
        if (error.response?.data != null) {
            return JSON.stringify(error.response.data);
        }

        return JSON.stringify({
            code: error.code,
            message: error.message,
            url: error.config?.url,
        });
    }

}
