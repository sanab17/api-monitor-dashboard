export interface ApiMonitor {
    name: string;
    url: string;
    // status: 'active' | 'inactive' | 'deprecated';
    status: 'UP' | 'DOWN';
    id?: string;          // optional, backend may not provide
    lastChecked?: string;  // optional
    responseTimeMs? : number; // optional
}
