/**
 * Raw response container returned by the REST handler.
 */
export class EOIResponse {
    /**
     * Endpoint-specific response payload.
     */
    public data: any;

    /**
     * @param success Indicates whether the request succeeded.
     * @param message Optional informational or error message.
     */
    constructor(public success: boolean, public message?: string) 
    {
    };

    /**
     * Creates a generic failure response.
     */
    static failure(): EOIResponse {
        return new EOIResponse(false, "Unknown error");
    }

    /**
     * Creates a generic success response.
     */
    static success(): EOIResponse {
        return new EOIResponse(true);
    }
}

