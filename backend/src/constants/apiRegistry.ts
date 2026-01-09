import { ApiTarget } from "../types/ApiTarget";

export const monitoredApis: ApiTarget[] = [
    {
        name: "User Service API - Example",
        url: "https://api.example.com/users",
        status: "inactive",
        description: "Handles user data and authentication.",
        responseTimeMs: null,
        lastChecked: null
    }
];