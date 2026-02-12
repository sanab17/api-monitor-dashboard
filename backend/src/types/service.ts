export enum ServiceStatus {
  OPERATIONAL = 'operational',
  DEGRADED = 'degraded',
  PARTIAL_OUTAGE = 'partial_outage',
  MAJOR_OUTAGE = 'major_outage',
  UNKNOWN = 'unknown'
}

export enum IncidentSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface Service {
  id: string;
  name: string;
  category: string;
  url: string;
  description?: string;
  status: ServiceStatus;
  uptime: number; // percentage
  responseTimeMs?: number;
  lastChecked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  category: string;
  services: Service[];
}

export interface UptimeRecord {
  serviceId: string;
  timestamp: Date;
  status: 'up' | 'down';
  responseTimeMs?: number;
}

export interface IncidentUpdate {
  id: string;
  message: string;
  timestamp: Date;
  author?: string;
}

export interface Incident {
  id: string;
  serviceId: string;
  serviceName: string;
  severity: IncidentSeverity;
  message: string;
  status: 'open' | 'investigating' | 'resolved';
  startedAt: Date;
  resolvedAt?: Date;
  updates: IncidentUpdate[];
}

export interface HealthCheckResult {
  serviceId: string;
  status: ServiceStatus;
  responseTimeMs: number;
  timestamp: Date;
  error?: string;
}

export interface DashboardSummary {
  totalServices: number;
  operationalServices: number;
  degradedServices: number;
  outageServices: number;
  activeIncidents: number;
  overallStatus: ServiceStatus;
}