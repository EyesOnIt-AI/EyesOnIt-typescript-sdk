export class EOIResponse {
    public data: any;

    constructor(public success: boolean, public message?: string) 
    {
    };

    static failure(): EOIResponse {
        return new EOIResponse(false, "Unknown error");
    }

    static success(): EOIResponse {
        return new EOIResponse(true);
    }
}

