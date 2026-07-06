import { EOIResponse } from "../eoiResponse";

export type EOIRESTRequestBody = unknown;
export type EOIRESTRequestHeaders = Record<string, string>;

export interface IEOIRESTHandler {
    
    get(endPoint: string): Promise<EOIResponse>;

    post(endPoint: string, body: EOIRESTRequestBody, headers: EOIRESTRequestHeaders): Promise<EOIResponse>;

}
