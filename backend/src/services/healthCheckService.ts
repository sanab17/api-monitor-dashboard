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