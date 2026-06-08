/**
 * GPU health metrics returned by the EyesOnIt `/health` endpoint.
 */
export class EOIGpu {
    public index?: number;
    public util_pct?: number;
    public mem_pct?: number;
    public mem_free_mb?: number;
    public dec_pct?: number;
    public enc_pct?: number;
    public temp_f?: number;
    public load_score_pct?: number;
    [key: string]: unknown;

    public static fromJsonObj(obj: any): EOIGpu | undefined {
        if (obj == null) {
            return undefined;
        }

        const gpu = new EOIGpu();
        Object.assign(gpu, obj);
        return gpu;
    }
}
