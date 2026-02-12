// export enum ServiceStatus {
export type ServiceStatus = 
    'operational' | 
    'degraded' | 
    'partial_outage' | 
    'major_outage' | 
    'unknown';

export interface Service {
    id: string;
    name: string;
    category: string;
    url : string;
    status: ServiceStatus;
    uptime: number;
    description?: string;
    responseTimeMs?: number;
    lastChecked?: Date
}

export interface ServiceCategory {
    category: string;
    services: Service[];
}

export interface Incident {
    id: string;
    serviceId: string;
    serviceName: string;
    severity: string;
    message: string;
    status: string;
    startedAt: Date;
}

export interface DashboardSummary {
    totalServices: number;
    operationalServices: number;
    degradedServices: number;
    outageServices: number;
    activeIncidents: number;
    overallStatus: ServiceStatus;
}