import { useEffect, useState } from "react";
import type { ApiMonitor } from "../types/ApiMonitor";
import { fetchApiMonitors, addApiMonitor } from "../api/apiClient";

function Dashboard() {
    const [monitors, setMonitors] = useState<ApiMonitor[]>([]);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch APIs on load
    useEffect(() => {
        loadApiMonitors(); // TODO: Temporarily disabled auto-refresh
    }, []);

    /*
    useEffect(() => {
        let interval: number;

        loadApiMonitors();

        interval = window.setInterval(loadApiMonitors, 90000); // Refresh every 90 seconds

        return () => clearInterval(interval);
    }, []);
    */

    async function loadApiMonitors() {
        try {
            const data = await fetchApiMonitors();
            setMonitors(data);
        } catch (err) {
            setError("Failed to load API monitors");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div>Loading APIs...</div>;
    };
    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    };

    async function handleAddMonitor(e: React.FormEvent) {
        e.preventDefault();
        if (!name || !url) {
            setError("Name and URL are required");
            return;
        }
        try {
            // const newMonitor = await addApiMonitor({ name, url, status: "DOWN" });
            const newMonitor = await addApiMonitor({ name, url, description });
            setMonitors([...monitors, newMonitor]);
            setName("");
            setUrl("");
            setDescription("");
            setError("");
            const data = await fetchApiMonitors();
            setMonitors(data);
        } catch (err) {
            setError("Failed to add API monitor");
        }
    }

    return (
        <div>
            <h1>Welcome to API Monitor Dashboard</h1>

            {monitors.length === 0 && <p>No APIs being monitored. Add one below!</p>}

            <ul style={{listStyle:"none", padding: 0}}>
                {
                    monitors.map((api) => (
                        <li
                            key={api.url}
                            style={{
                                border: "1px solid #ddd",
                                padding: "1rem",
                                marginBottom: "0.5rem",
                                borderRadius: "6px"
                            }}
                        >
                            <strong>{api.name}</strong>
                            <div>{api.url}</div>

                            <span style={{
                                color: api.status === 'UP' ? 'green' : 'red',
                                fontWeight: 'bold'
                            }}>
                                {api.status}
                            </span>

                            {api.responseTimeMs && (
                                <span> * {api.responseTimeMs}ms</span>
                            )}
                        </li>
                    ))}
            </ul>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleAddMonitor} style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="API Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginRight: "0.5rem" }}
                    required
                />
                <input
                    type="text"
                    placeholder="API URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ marginRight: "0.5rem" }}
                    required
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ marginRight: "0.5rem" }}
                />
                <button type="submit">
                    Add API
                </button>
            </form>

            {/* <ul>
                {monitors.map((api) => (
                    <li key={api.url}>
                        <strong>{api.name}</strong> - {api.status} - {api.lastChecked || "Never Checked"}
                    </li>
                ))}
            </ul> */}

        </div>
    );
}

export default Dashboard;