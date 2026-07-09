import { EOIResponse } from "../eoiResponse";
import { EOIBaseOutputs } from "./eoiBaseOutputs";

export interface EOIRemoteManagementStatus {
    enabled: boolean;
    service_running: boolean;
    base_url_configured: boolean;
    api_key_file_configured: boolean;
    location_id_configured: boolean;
    resource_types: string[];
    sync_interval_seconds: number;
    settings_sync_enabled: boolean;
    last_success_at?: string | null;
    last_failure_at?: string | null;
    last_failure_message?: string | null;
    last_change_count: number;
    remote_record_counts: Record<string, number>;
    cached_image_count: number;
}

export class EOIRemoteManagementStatusResponse extends EOIBaseOutputs {
    public data: EOIRemoteManagementStatus | null = null;
    public status: EOIRemoteManagementStatus | null = null;

    constructor(eoiResponse: EOIResponse) {
        super(eoiResponse);
        if (this.success && eoiResponse.data != null) {
            this.data = eoiResponse.data as EOIRemoteManagementStatus;
            this.status = this.data;
        }
    }
}
