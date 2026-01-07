type ApiTarget = {
    name: string;
    url: string;
    status: 'active' | 'inactive' | 'deprecated';
    description?: string;
    responseTimeMs?: number;
    lastChecked?: Date;
};
