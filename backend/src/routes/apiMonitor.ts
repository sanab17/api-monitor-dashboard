import { Router, Request, Response } from 'express';
import { monitoredApis } from '../constants/apiRegistry';
import { ApiTarget } from '../types/ApiTarget';

const router = Router();

router.get('/monitor', async (_req: Request, res: Response) => {
    res.json(monitoredApis);
});

router.post('/', (req: Request, res: Response) => {
    const { name, url } = req.body;

    // Basic validation
    if (!name || !url) {
        return res.status(400).json({ message: 'Name and URL are required' });
    }

    // Prevent duplicates
    const existingApi = monitoredApis.find(api => api.url === url);
    if (existingApi) {
        return res.status(409).json({ message: 'API with this URL already exists' });
    }

    const newApi: ApiTarget = {
        name,
        url,
        status: 'inactive',
        description: null,
        responseTimeMs: null,
        lastChecked: null
    };
    
    monitoredApis.push(newApi);

    res.status(201).json({
        message: 'API added successfully', 
        api: newApi
    });
});

export default router;