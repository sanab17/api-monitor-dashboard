import { Service, ServiceStatus, UptimeRecord, Incident, ServiceCategory } from '../types/service';

// In-memory storage (replace with database in production)
class ServiceStore {
    private services: Map<string, Service> = new Map();
    private uptimeRecords: Map<string, UptimeRecord[]> = new Map();
    private incidents: Map<string, Incident> = new Map();

    // Sample data initialization
    constructor() {
        this.initializeSampleData();
    }

    private initializeSampleData() {
        // Sample services
        const sampleServices: Service[] = [
            {
                id: '1',
                name: 'User Authentication',
                category: 'Core Services',
                url: 'https://auth.example.com/health',
                description: 'Handles user authentication and authorization.',
                status: ServiceStatus.OPERATIONAL,
                uptime: 99.99,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'Payment Processing',
                category: 'Core Services',
                url: 'https://payments.example.com/health',
                description: 'Handles all payment transactions and processing.',
                status: ServiceStatus.DEGRADED,
                uptime: 98.50,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '3',
                name: 'REST API',
                category: 'API Services',
                url: 'https://api.example.com/health',
                description: 'Monitors the health of the main REST API endpoints.',
                status: ServiceStatus.OPERATIONAL,
                uptime: 99.98,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '4',
                name: 'Database Cluster',
                category: 'Infrastructure Services',
                url: 'https://db-monitor.example.com/health',
                description: 'Monitors the health of the primary database cluster.',
                status: ServiceStatus.OPERATIONAL,
                uptime: 99.99,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        sampleServices.forEach(service => {
                this.services.set(service.id, service);
                this.generateUptimeHistory(service.id, service.uptime);
            }
        );
    };

    // Generate sample uptime history for the past 90 days
    private generateUptimeHistory(serviceId: string, currentUptime: number) {
        const records: UptimeRecord[] = [];
        const now = new Date();

        for (let i = 90; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // 24 hours in milliseconds
            const isUp = Math.random() * 100 <= currentUptime; // Simulate based on current uptime percentage

            records.push({
                serviceId,
                timestamp,
                status: isUp ? 'up' : 'down',
                responseTimeMs: isUp ? Math.floor(Math.random() * 500) + 50 : undefined // 50-550ms for 'up' status
            });
        }

        this.uptimeRecords.set(serviceId, records);
    };

    // Service CRUD operations
    public getAllServices(): Service[] {
        return Array.from(this.services.values());  
    };

    // Select services by category
    public getServicesByCategory(): ServiceCategory[] {
        const categories = new Map<string, Service[]>();

        this.services.forEach(service => {
            if (!categories.has(service.category)) {
                categories.set(service.category, []);
            }
            categories.get(service.category)!.push(service);
        });

        return Array.from(categories.entries()).map(
            ([category, services]) => ({
                category,
                services
            })
        );
    };

    // Get service by ID
    public getServiceById(serviceId: string): Service | undefined {
        return this.services.get(serviceId);
    };

    // Add new service
    public addService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
        const newService: Service = {
            ...service,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.services.set(newService.id, newService); // Initialize empty service
        this.uptimeRecords.set(newService.id, []); // Initialize empty uptime records
        return newService;
    };

    // Update existing service
    public updateService(serviceId: string, updates: Partial<Service>): Service | undefined {
        const service = this.services.get(serviceId);
        if (!service) return undefined;

        const updatedService = {
            ...service,
            ...updates,
            updatedAt: new Date()
        };

        this.services.set(serviceId, updatedService);
        return updatedService;
    };

    // Delete service
    public deleteService(serviceId: string): boolean {
        const deleted = this.services.delete(serviceId);
        this.uptimeRecords.delete(serviceId);
        return deleted;
    };

    // Uptime history operations
    public getUptimeHistory(serviceId: string, days: number = 90): UptimeRecord[] {
        const records = this.uptimeRecords.get(serviceId) || [];
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        return records.filter(record => record.timestamp >= cutoffDate);
    };

    // Add uptime record
    public addUptimeRecord(record: UptimeRecord): void {
        const records = this.uptimeRecords.get(record.serviceId) || [];
        records.push(record);
        this.uptimeRecords.set(record.serviceId, records);

        // Calculate new uptime percentage
        this.updateUptimePercentage(record.serviceId);
    };

    // Update uptime percentage based on records
    private updateUptimePercentage(serviceId: string): void {
        const records = this.getUptimeHistory(serviceId, 90); // Default to 90 days history
        if (records.length === 0) return;

        const upCount = records.filter(r => r.status === 'up').length;
        const uptimePercentage = (upCount / records.length) * 100;

        const service = this.services.get(serviceId);
        if (service) {
            service.uptime = Number(uptimePercentage.toFixed(2));
            service.updatedAt = new Date();
        }
    };

    // Incident management
    public getAllIncidents(): Incident[] {
        return Array.from(this.incidents.values());
    };

    // Get active incidents
    public getActiveIncidents(): Incident[] {
        return Array.from(this.incidents.values()).filter(
            incident => incident.status !== 'resolved'
        );
    };

    // Add new incident
    public addIncident(incident: Omit<Incident, 'id'>): Incident {
        const newIncident: Incident = {
            ...incident,
            id: Date.now().toString()
        };

        this.incidents.set(newIncident.id, newIncident);
        return newIncident;
    };

    // Update existing incident
    public updateIncident(incidentId: string, updates: Partial<Incident>): Incident | undefined {
        const incident = this.incidents.get(incidentId);
        if (!incident) return undefined;

        const updatedIncident = {
            ...incident,
            ...updates
        };

        this.incidents.set(incidentId, updatedIncident);
        return updatedIncident;
    };
};

export const serviceStore = new ServiceStore();