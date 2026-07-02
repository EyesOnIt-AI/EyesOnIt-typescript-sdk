import { EOIVertex } from "./eoiVertex";

export class EOICameraCalibration {
    public calibration_id?: string | null;
    public method: string = "planar_homography";
    public image_points: EOIVertex[] = [];
    public world_points: EOIVertex[] = [];
    public unit: string = "meters";
    public rms_error?: number | null;
    public calibrated_at?: string | null;

    constructor(init?: Partial<EOICameraCalibration>) {
        Object.assign(this, init);
    }

    public static fromJsonObj(obj: any): EOICameraCalibration | undefined {
        if (obj == null) {
            return undefined;
        }

        return new EOICameraCalibration({
            calibration_id: obj.calibration_id,
            method: obj.method ?? "planar_homography",
            image_points: Array.isArray(obj.image_points) ? obj.image_points.map(EOIVertex.fromJsonObj) : [],
            world_points: Array.isArray(obj.world_points) ? obj.world_points.map(EOIVertex.fromJsonObj) : [],
            unit: obj.unit ?? "meters",
            rms_error: obj.rms_error,
            calibrated_at: obj.calibrated_at,
        });
    }

    public static default(): EOICameraCalibration {
        return new EOICameraCalibration({
            calibration_id: null,
            method: "planar_homography",
            image_points: [],
            world_points: [],
            unit: "meters",
            rms_error: null,
            calibrated_at: null,
        });
    }
}
