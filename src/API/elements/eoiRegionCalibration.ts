import { EOIVertex } from "./eoiVertex";

export type EOIRegionCalibrationStatus =
    | "not_configured"
    | "needs_validation"
    | "calibrated"
    | "invalid";

export class EOIRegionCalibration {
    public calibration_id?: string | null;
    public status: EOIRegionCalibrationStatus = "not_configured";
    public method: string = "planar_homography";
    public image_points: EOIVertex[] = [];
    public world_points: EOIVertex[] = [];
    public unit: string = "meters";
    public rms_error?: number | null;
    public calibrated_at?: string | null;
    public reviewer_note?: string | null;

    constructor(init?: Partial<EOIRegionCalibration>) {
        Object.assign(this, init);
    }

    public static fromJsonObj(obj: any): EOIRegionCalibration | undefined {
        if (obj == null) {
            return undefined;
        }

        return new EOIRegionCalibration({
            calibration_id: obj.calibration_id,
            status: obj.status ?? "not_configured",
            method: obj.method ?? "planar_homography",
            image_points: Array.isArray(obj.image_points) ? obj.image_points.map(EOIVertex.fromJsonObj) : [],
            world_points: Array.isArray(obj.world_points) ? obj.world_points.map(EOIVertex.fromJsonObj) : [],
            unit: obj.unit ?? "meters",
            rms_error: obj.rms_error,
            calibrated_at: obj.calibrated_at,
            reviewer_note: obj.reviewer_note,
        });
    }

    public static default(): EOIRegionCalibration {
        return new EOIRegionCalibration({
            calibration_id: null,
            status: "not_configured",
            method: "planar_homography",
            image_points: [],
            world_points: [],
            unit: "meters",
            rms_error: null,
            calibrated_at: null,
            reviewer_note: null,
        });
    }
}
