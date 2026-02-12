import axios from 'axios';
import { serviceStore } from './serviceStore';
import { HealthCheckResult, IncidentSeverity, ServiceStatus } from '../types/service';

export class HealthCheckService {

    private checkIntervalMs: number = 5 * 60 * 1000; // 5 minutes
    private intervalId?: NodeJS.Timeout;

    // Start periodic health checks
    public startMonitoring() {
        console.log('🔍 Starting Health check monitoring...');
        this.performHealthChecks(); // Initial check

        this.intervalId = setInterval(() => {
            this.performHealthChecks();
        }, this.checkIntervalMs);
    };

    // Stop periodic health checks
    public stopMonitoring() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log('🛑 Stopped Health check monitoring.');
        }
    };

    // Perform health checks for all services
    public async performHealthChecks(): Promise<void> {
        const services = serviceStore.getAllServices();
        console.log(`🔄 Checking ${services.length} services...`);

        const results = await Promise.allSettled(
            services.map(
                service => this.checkService(service.id, service.url)
            )
        );

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`✅ Service ${services[index].name} is healthy.`);
                this.handleCheckResult(result.value);
            } else {
                console.error(`❌ Health check failed for service ${services[index].name}: ${result.reason}`);
            }
        });
    };

    // Check individual service health
    private async checkService(serviceId: string, url: string): Promise<HealthCheckResult> {
        const startTime = Date.now();

        try {
            const response = await axios.get(url, { timeout: 10000 });
            const responseTimeMs = Date.now() - startTime;

            const status = this.determineStatus(responseTimeMs, response.status);

            return {
                serviceId,
                status,
                responseTimeMs,
                timestamp: new Date()
            };
        } catch (error: any) {
            const responseTimeMs = Date.now() - startTime;

            return {
                serviceId,
                status: ServiceStatus.MAJOR_OUTAGE,
                responseTimeMs,
                timestamp: new Date(),
                error: error.message
            };
        }

    };

    // Determine service status based on response time and HTTP status
    private determineStatus(responseTime: number, httpStatus: number): ServiceStatus {
        if (httpStatus >= 500) {
            return ServiceStatus.MAJOR_OUTAGE;
        }
        if (httpStatus >= 400) {
            return ServiceStatus.PARTIAL_OUTAGE;
        }
        if (responseTime > 2000) { // 2 seconds threshold
            return ServiceStatus.DEGRADED;
        }
        return ServiceStatus.OPERATIONAL;
    };

    // Handle the result of a health check
    private handleCheckResult(result: HealthCheckResult): void {
        const service = serviceStore.getServiceById(result.serviceId);
        if (!service) {
            console.error(`Service with ID ${result.serviceId} not found.`);
            return;
        }

        const previousStatus = service.status;

        // Update service status based on health check result
        serviceStore.updateService(result.serviceId, {
            status: result.status,
            responseTimeMs: result.responseTimeMs,
            lastChecked: result.timestamp
        });

        // Record uptime history
        serviceStore.addUptimeRecord({
            serviceId: result.serviceId,
            status: result.status === ServiceStatus.OPERATIONAL ? 'up' : 'down',
            timestamp: result.timestamp,
            responseTimeMs: result.responseTimeMs
        });

        // Create incident if status changed to degraded or worse
        if (previousStatus === ServiceStatus.OPERATIONAL && result.status !== ServiceStatus.OPERATIONAL) {
            this.createIncident(result);
        }

        console.log(`✓ ${service.name}: ${result.status} (${result.responseTimeMs}ms)`);
    };

    // Create a new incident based on health check result
    private createIncident(result: HealthCheckResult): void {
        const service = serviceStore.getServiceById(result.serviceId);
        if (!service) return;

        const severityMap = {
            [ServiceStatus.DEGRADED]: IncidentSeverity.WARNING,
            [ServiceStatus.PARTIAL_OUTAGE]: IncidentSeverity.ERROR,
            [ServiceStatus.MAJOR_OUTAGE]: IncidentSeverity.CRITICAL,
            [ServiceStatus.OPERATIONAL]: IncidentSeverity.INFO,
            [ServiceStatus.UNKNOWN]: IncidentSeverity.INFO
        };
        
        serviceStore.addIncident({
            serviceId: result.serviceId,
            serviceName: service.name,
            severity: severityMap[result.status],
            message: result.error || `Service experiencing ${result.status}`,
            status: 'investigating',
            startedAt: new Date(),
            updates: []
        });
    };

};

export const healthCheckService = new HealthCheckService();

/* -- TEMPORARILY COMMENTED --
import { ApiTarget } from '../types/ApiTarget';
import { monitoredApis } from '../constants/apiRegistry';

const TIMEOUT_MS = 3000;

export const performHealthChecks = async (): Promise<void> => {
    for (const api of monitoredApis) {
        await checkApiHealth(api);
    }
};

export const checkApiHealth = async (api: ApiTarget): Promise<ApiTarget> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const startTime = Date.now();

    try {
        const response = await fetch(api.url, {
            method: 'GET', 
            signal: controller.signal 
        });

        const responseTime = Date.now() - startTime;

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        return {
            ...api,
            status: response.ok ? 'active' : 'inactive',
            lastChecked: new Date(),
            responseTimeMs: responseTime
        };

    } catch (error) {
        clearTimeout(timeoutId);
        
        return {
            ...api,
            status: 'inactive',
            lastChecked: new Date(),
            responseTimeMs: null
        }
    }
};
*/