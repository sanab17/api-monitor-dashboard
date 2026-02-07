import express, { Request, Response } from 'express';
import { serviceStore } from '../services/serviceStore'
import { Service, ServiceStatus, DashboardSummary } from '../types/service';

const router = express.Router();

// GET /api/dashboard/summary - Get overall dashboard summary
router.get('/summary', (_req: Request, res: Response) => {
    try {
        const services = serviceStore.getAllServices();
        const incidents = serviceStore.getActiveIncidents();

        const summary: DashboardSummary = {
            totalServices: services.length,
            operationalServices: services.filter(
                service => service.status === ServiceStatus.OPERATIONAL
            ).length,
            degradedServices: services.filter(
                service => service.status === ServiceStatus.DEGRADED
            ).length,
            outageServices: services.filter(
                service => service.status === ServiceStatus.PARTIAL_OUTAGE || 
                            service.status === ServiceStatus.MAJOR_OUTAGE
            ).length,
            activeIncidents: incidents.length,
            overallStatus: determineOverallStatus(services)
        };

        return res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard summary' });
    }
});

// GET /api/dashboard/services - Get all services grouped by category
router.get('/services', (_req: Request, res: Response) => {
    try {
        const servicesByCategory = serviceStore.getServicesByCategory();
        res.json(servicesByCategory);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch services' });
    }
});

// GET /api/dashboard/services/:id - Get service by ID
router.get('/services/:id', (req: Request, res: Response) => {
    try {
        const service = serviceStore.getServiceById(req.params.id);

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const uptimeHistory = serviceStore.getUptimeHistory(req.params.id, 90);

        res.json({
            ...service,
            uptimeHistory
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch service details' });
    }
});

// POST /api/dashboard/services - Add new service
router.post('/services', (req: Request, res: Response) => {
    try {
        const { name, category, url, description } = req.body;

        if (!name || !category || !url ) {
            return res.status(400).json({
                error: 'Missing required feilds: name, category, url'
            });
        }

        const newService = serviceStore.addService({
            name,
            category,
            url,
            description,
            status: ServiceStatus.UNKNOWN,
            uptime: 0
        });

        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// PUT /api/dashboard/services/:id - Update existing service
router.put('/services/:id', (req: Request, res: Response) => {
    try {
        const updates = req.body;
        const udpatedService = serviceStore.updateService(req.params.id, updates);

        if (!udpatedService) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json(udpatedService);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// DELETE /api/dashboard/services/:id - Delete service
router.delete('/services/:id', (req: Request, res: Response) => {
    try {
        const deleted = serviceStore.deleteService(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

// GET /api/dashboard/incidents - Get all incidents
router.get('/incidents', (req: Request, res: Response) => {
    try {
        const activeOnly = req.query.active === 'true';
        const incidents = activeOnly 
                ? serviceStore.getActiveIncidents() 
                : serviceStore.getAllIncidents

        res.json(incidents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch incidents' });
    }
});

// GET /api/dashboard/uptime/:serviceId - Get uptime history for a service
router.get('/uptime/:serviceId', (req: Request, res: Response) => {
    try {
        const days = Number(req.params.days as string) || 90;
        const uptimeHistory = serviceStore.getUptimeHistory(req.params.serviceId, days)
    
        res.json(uptimeHistory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch uptime history' });
    }
});

function determineOverallStatus(services: Service[]): ServiceStatus {
    const hasOutage = services.some(
        service => 
            service.status === ServiceStatus.MAJOR_OUTAGE ||
            service.status === ServiceStatus.PARTIAL_OUTAGE 
    );

    const hasDegraded = services.some(
        service => 
            service.status === ServiceStatus.DEGRADED
    );

    if (hasOutage) return ServiceStatus.PARTIAL_OUTAGE;
    if (hasDegraded) return ServiceStatus.DEGRADED;

    return ServiceStatus.OPERATIONAL;
};

export default router;