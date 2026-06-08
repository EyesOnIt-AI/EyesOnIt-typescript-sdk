/**
 * System health metrics returned by the EyesOnIt `/health` endpoint.
 */
export class EOISystemHealth {
    public cpu_pct?: number;
    public ram_pct?: number;
    public ram_free_mb?: number;
    [key: string]: unknown;

    public static fromJsonObj(obj: any): EOISystemHealth | undefined {
        if (obj == null) {
            return undefined;
        }

        const systemHealth = new EOISystemHealth();
        Object.assign(systemHealth, obj);
        return systemHealth;
    }
}
