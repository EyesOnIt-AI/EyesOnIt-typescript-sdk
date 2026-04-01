import { EOIGenetecDetectionConfig } from "./eoiGenetecDetectionConfig";

export class EOIVMSDetectionConfig {
    public genetec: EOIGenetecDetectionConfig | undefined = undefined;

    constructor() {
    }

    public static fromJsonObj(obj: any): EOIVMSDetectionConfig | undefined {
        let vmsDetectionConfig = undefined;

        if (obj != null) {
            vmsDetectionConfig = new EOIVMSDetectionConfig();
            vmsDetectionConfig.genetec = EOIGenetecDetectionConfig.fromJsonObj(obj.genetec);
        }

        return vmsDetectionConfig;
    }
}
