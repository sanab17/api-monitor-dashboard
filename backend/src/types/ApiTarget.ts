export type ApiStatus = 'active' | 'inactive' | 'deprecated';

export interface ApiTarget {
    name: string;
    url: string;
    status: ApiStatus;
    description?: string | null;
    responseTimeMs?: number | null;
    lastChecked?: Date | null;
}