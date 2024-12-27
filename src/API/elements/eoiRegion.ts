import { EOIDetectionConfig } from "./eoiDetectionConfig";
import { EOIMotionDetection } from "./eoiMotionDetection";
import { EOIVertex } from "./eoiVertex";

export class EOIRegion {
    private static nextId = 1;

    public enabled: boolean = true;
    public id: number;
    public name: string;
    public polygon: EOIVertex[];
    public detection_configs: EOIDetectionConfig[];
    public motion_detection?: EOIMotionDetection;

    constructor() {
        this.id = EOIRegion.nextId;
        EOIRegion.nextId++;

        this.polygon = [];
    }

    static fromJsonObj(obj: any): EOIRegion {
        let region = new EOIRegion();

        if (obj.enabled != null) {
            region.enabled = obj.enabled;
        }

        region.id = obj.id;
        region.name = obj.name;
        region.polygon = obj.polygon?.map(EOIVertex.fromJsonObj);
        region.detection_configs = obj.detection_configs?.map(EOIDetectionConfig.fromJsonObj);

        if (region.detection_configs == null || region.detection_configs?.length == 0) {
            let newDetectionConfig = EOIDetectionConfig.default();
            region.detection_configs = [ newDetectionConfig ];
        }

        region.motion_detection = EOIMotionDetection.fromJsonObj(obj.motion_detection);

        if (region.motion_detection == null) {
            region.motion_detection = EOIMotionDetection.default();
        }
        return region;
    }
}