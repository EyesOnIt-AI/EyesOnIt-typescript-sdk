import { EOIResponse } from "../eoiResponse";

export interface IEOIRESTHandler {
    
    get(endPoint: string): Promise<EOIResponse>;

    post(endPoint: string, body: string, headers: any): Promise<EOIResponse>;

}