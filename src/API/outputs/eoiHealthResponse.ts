import { EOIGpu } from "../elements/eoiGpu";
import { EOISystemHealth } from "../elements/eoiSystemHealth";
import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

/**
 * Response wrapper for `health`.
 */
export class EOIHealthResponse extends EOIBaseOutputs {
    /**
     * Raw health payload returned by the server.
     */
    public data: any;

    /**
     * Per-GPU health metrics.
     */
    public gpus: EOIGpu[] = [];

    /**
     * Host system health metrics.
     */
    public system?: EOISystemHealth;

    /**
     * @param eoiResponse Raw API response.
     */
    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        this.data = eoiResponse.data;

        if (this.success) {
            if (eoiResponse.data?.gpus != null) {
                this.gpus = eoiResponse.data.gpus
                    .map(EOIGpu.fromJsonObj)
                    .filter((gpu: EOIGpu | undefined): gpu is EOIGpu => gpu != null);
            }

            this.system = EOISystemHealth.fromJsonObj(eoiResponse.data?.system);
        }
    }
}

