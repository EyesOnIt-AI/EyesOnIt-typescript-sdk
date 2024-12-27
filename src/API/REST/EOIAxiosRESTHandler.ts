import axios from "axios";
import { EOIResponse } from "../eoiResponse";
import { IEOIRESTHandler } from "./IEOIRESTHandler";
import { Logger } from "../../utils/logger";

export class EOIAxiosRESTHandler implements IEOIRESTHandler {
    private logger;

    constructor(private customLogger?: any) {
        this.logger = customLogger || new Logger();
    }

    public async get(endPoint: string): Promise<EOIResponse> {
        let eoiResponse: EOIResponse | null = null;

        await axios.get(endPoint).then(async (response: any) => {
            eoiResponse = new EOIResponse(response.data.success, response.data.message);
            eoiResponse.data = response.data.data;
        }).catch(async (error: any) => {
            this.logger.error(`EOIAxiosRESTHandler.get error: ${JSON.stringify(error.response?.data)}`);
            eoiResponse = new EOIResponse(false, error.message);
        });

        if (eoiResponse == null) {
            eoiResponse = new EOIResponse(false, "Unknown error");
        }

        return eoiResponse;
    }

    public async post(endPoint: string, body: string, headers: any): Promise<EOIResponse> {
        let eoiResponse: EOIResponse | null = null;

        await axios.post(endPoint, body, { headers: headers }).then(async (response: any) => {
            eoiResponse = new EOIResponse(response.data.success, response.data.message);
            eoiResponse.data = response.data.data;
        }).catch(async (error: any) => {
            this.logger.error(`EOIAxiosRESTHandler.post error: ${JSON.stringify(error.response?.data)}`);
            eoiResponse = new EOIResponse(false, error.message);
        });

        if (eoiResponse == null) {
            eoiResponse = new EOIResponse(false, "Unknown error");
        }

        return eoiResponse;
    }

}