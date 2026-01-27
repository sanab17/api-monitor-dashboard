import type { ApiMonitor } from "../types/ApiMonitor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchApiMonitors = async (): Promise<ApiMonitor[]> => {
    const response = await fetch(`${BASE_URL}/api/monitor`);
    if (!response.ok) {
        throw new Error("Failed to fetch API monitors");
    }

    const data = await response.json();

    return data.map((monitor: ApiMonitor) => ({
        name: monitor.name,
        url: monitor.url,
        status: monitor.status === 'UP' ? 'UP' : 'DOWN',
        lastChecked: monitor.lastChecked,
        responseTimeMs: monitor.responseTimeMs
    }));
};

// export const addApiMonitor = async (monitor: Omit<ApiMonitor, "id" | "lastChecked">): Promise<ApiMonitor> => {
export const addApiMonitor = async (payload: {
    name: string;
    url: string;
    description?: string;
}): Promise<ApiMonitor> => {
    const response = await fetch(`${BASE_URL}/api`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // body: JSON.stringify(monitor),
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error("Failed to add API monitor");
    }
    return response.json();
};

export const deleteApiMonitor = async (id: string): Promise<void> => {
    const response = await fetch(`/api/monitors/${id}`, { // TODO: Create DELETE endpoint in backend
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete API monitor");
    }
};