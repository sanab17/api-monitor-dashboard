const DASHBOARD_API_BASE_URL = import.meta.env.VITE_DASHBOARD_API_BASE_URL || 'http://localhost:3000';

export const dashboardApi = {

    // Fetches the dashboard summary, including overall status and key metrics
    async getSummary() {
        const response = await fetch(`${DASHBOARD_API_BASE_URL}/api/dashboard/summary`);
        if (!response.ok) {
            throw new Error('Failed to fetch summary');
        }
        return response.json();
    },

    // Fetches the list of all services being monitored, along with their current status
    async getServices() {
        const response = await fetch(`${DASHBOARD_API_BASE_URL}/api/dashboard/services`);
        if (!response.ok) {
            throw new Error(`Failed to fetch services: ${response.status}`);
        }
        return response.json();
    },

    // Fetches detailed information about a specific service, including its status, uptime, and response times
    async getServiceById(serviceId: string) {
        const response = await fetch(`${DASHBOARD_API_BASE_URL}/api/dashboard/services/${serviceId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch service details');
        }
        return response.json();
    },

    // Fetches the list of active incidents affecting the services, including their status and impact
    async getIncidents(activeOnly = true) {
        const url = `${DASHBOARD_API_BASE_URL}/api/dashboard/incidents${activeOnly ? '?active=true' : ''}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch incidents: ${response.status}`);
        }
        // return response.json();

        // Handle empty response
        const text = await response.text();
        if (!text) {
            return [];  // Return empty array if no content
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('Failed to parse incidents JSON:', text);
            return [];  // Return empty array on parse error
        }
    },

    // Fetches the uptime history for a specific service, which can be used to display trends and historical performance
    async getUptimeHistory(serviceId: string, days = 90) {
        const response = await fetch(`${DASHBOARD_API_BASE_URL}/api/dashboard/services/${serviceId}/uptime-history?days=${days}`);
        if (!response.ok) {
            throw new Error('Failed to fetch uptime history');
        }
        return response.json();
    },

    // Adds a new service to be monitored, allowing users to specify the service name, category, URL, and description
    async addService(serviceData: { name: string; category: string; url: string; description?: string }) {
        const response = await fetch(`${DASHBOARD_API_BASE_URL}/api/dashboard/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        });
        if (!response.ok) {
            throw new Error('Failed to add service');
        }
        return response.json();
    }
};
