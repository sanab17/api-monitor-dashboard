import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Alert,
    AlertTitle,
    Chip,
    Grid,
    CircularProgress,
    Divider,
    Stack
} from '@mui/material';
// import Grid from '@mui/material/Grid2';
import {
    CheckCircle,
    Warning,
    Error,
    Cancel,
    Assessment,
    AccessTime
} from '@mui/icons-material';
import { dashboardApi } from '../api/dashboardApi';
import type { ServiceCategory, Incident } from '../types/service';

function StatusDashboard() {
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                /*
                const [servicesData, incidentsData] = await Promise.all(
                    [
                        dashboardApi.getServices(),
                        dashboardApi.getIncidents()
                    ]
                );

                setServices(servicesData);
                setIncidents(incidentsData);
                */

                // Load services first, then incidents to ensure we have service data for incident display
                const servicesData = await dashboardApi.getServices();
                setServices(servicesData);

                // Load incidents with error handling to prevent total failure if incidents endpoint has issues
                try {
                    const incidentsData = await dashboardApi.getIncidents();
                    setIncidents(incidentsData);
                } catch (incidentError) {
                    console.warn('Failed to load incidents, using empty array:', incidentError);
                    setIncidents([]);
                }

                setLastUpdated(new Date());
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
        const interval = setInterval(loadData, 24 * 12 * 60000); // Refresh every 12 hours
        return () => clearInterval(interval);
    }, []);

    // Helper function to get status configuration based on the status string
    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'operational':
                return {
                    icon: <CheckCircle sx={{ color: 'success.main' }} />,
                    color: 'success' as const,
                    text: 'Operational',
                    chipColor: 'success' as const
                };
            case 'degraded':
                return {
                    icon: <Warning sx={{ color: 'warning.main' }} />,
                    color: 'warning' as const,
                    text: 'Degraded Performance',
                    chipColor: 'warning' as const
                };
            case 'partial_outage':
                return {
                    icon: <Error sx={{ color: 'error.main' }} />,
                    color: 'error' as const,
                    text: 'Partial Outage',
                    chipColor: 'error' as const
                };
            case 'major_outage':
                return {
                    icon: <Error sx={{ color: 'error.main' }} />,
                    color: 'error' as const,
                    text: 'Major Outage',
                    chipColor: 'error' as const
                };
            default:
                return {
                    icon: <Assessment sx={{ color: 'grey.500' }} />,
                    color: 'default' as const,
                    text: 'Unknown',
                    chipColor: 'default' as const
                };
        }
    };

    // Determine if all services are operational
    const allOperational = services.every(
        category =>
            category.services.every(
                service => service.status === 'operational'
            )
    );

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    bgcolor: 'grey.50'
                }}
            >
                <Box textAlign='center'>
                    <CircularProgress size={60} />
                    <Typography variant='h6' sx={{ mt: 2, color: 'text.secondary' }}>
                        Loading dashboard data...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 4 }}>
            {/* Header */}
            <Paper sx={{ borderRadius: 0, mb: 3 }} elevation={1}>
                <Container maxWidth='lg' sx={{ py: 3 }}>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Box>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
                                <Box>
                                    <Typography variant='h4' component='h1' fontWeight='bold'>
                                        System Status Dashboard
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        Real-time monitoring of all services and incidents
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                        <Box textAlign='right'>
                            <Stack direction='row' spacing={1} alignItems='center'>
                                <AccessTime fontSize='small' color='action' />
                                <Typography variant='body2' color='text.secondary'>
                                    Updated: {lastUpdated.toLocaleTimeString()}
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            {/* Overall Status Alert */}
            <Alert
                severity={allOperational ? 'success' : 'warning'}
                sx={{ borderRadius: 0, mb: 3 }}
                icon={allOperational ? <CheckCircle fontSize='large' /> : <Warning fontSize='large' />}
            >
                <AlertTitle sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {allOperational ? 'All Systems Operational' : 'Some Services Experiencing Issues'}
                </AlertTitle>
                {allOperational
                    ? 'All services are running normally. No incidents reported.'
                    : "We're working to resolve these as quickly as possible. Please check the details below for more information on affected services and ongoing incidents."}
            </Alert>

            <Container>
                {/* Active Incidents */}
                {
                    incidents.length > 0 && (
                        <Paper sx={{ mb: 3 }} elevation={2}>
                            <Box sx={{ bgcolor: 'error.light', color: 'error.contrastText', px: 3, py: 2 }}>
                                <Typography variant='h6' fontWeight='bold'>
                                    Active Incidents ({incidents.length})
                                </Typography>
                            </Box>
                            <Divider />
                            <Box>
                                {incidents.map(
                                    (incident, index) => {
                                        const statusConfig = getStatusConfig(incident.severity);
                                        return (
                                            <Box key={incident.id}>
                                                <Box sx={{ px: 3, py: 2, '&hover': { bgcolor: 'grey.50' } }}>
                                                    <Grid container spacing={2} alignItems='center'>
                                                        <Grid>
                                                            {statusConfig.icon}
                                                        </Grid>
                                                        <Grid sx={{ flexGrow: 1 }}>
                                                            <Typography variant='subtitle1' fontWeight='medium'>
                                                                {incident.serviceName}
                                                            </Typography>
                                                            <Typography variant='body2' color='text.secondary'>
                                                                {incident.message}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography variant='body2' color='text.secondary'>
                                                                {incident.startedAt.toLocaleString()}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                                {index < incidents.length - 1 && <Divider />}
                                            </Box>
                                        );
                                    }
                                )}
                            </Box>
                        </Paper>
                    )
                }

                {/* Services by Category */}
                <Stack spacing={3}>
                    {services.map((category) => (
                        <Paper>
                            <Box>
                                <Typography>
                                    {category.category}
                                </Typography>
                            </Box>
                            <Divider />

                            {/* Services List */}
                            <Box>
                                {category.services.map((service, index) => {
                                    const statusConfig = getStatusConfig(service.status);
                                    return (
                                        <Box key={service.id}>
                                            <Box
                                                sx={{
                                                    px: 3,
                                                    py: 2.5,
                                                    '&:hover': { bgcolor: 'grey.50', cursor: 'pointer' }
                                                }}
                                            >
                                                <Grid container spacing={2} alignItems='center'>
                                                    {/* Status Icon */}
                                                    <Grid>
                                                        {statusConfig.icon}
                                                    </Grid>

                                                    {/* Service Name and Status */}
                                                    <Grid sx={{ flexGrow: 1 }}>
                                                        <Typography variant='subtitle1' fontWeight='medium'>
                                                            {service.name}
                                                        </Typography>
                                                        <Typography variant='body2' sx={{ color: `${statusConfig.color}.main` }}>
                                                            {statusConfig.text}
                                                        </Typography>
                                                    </Grid>

                                                    {/* Response Time */}
                                                    {service.responseTimeMs && (
                                                        <Grid>
                                                            <Box textAlign='center'>
                                                                <Typography variant='body1' fontWeight='medium'>
                                                                    {service.responseTimeMs} ms
                                                                </Typography>
                                                                <Typography variant='caption' color='text.secondary'>
                                                                    Response Time
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    )}

                                                    {/* Uptime */}
                                                    <Grid>
                                                        <Box textAlign='center'>
                                                            <Typography variant='body1' fontWeight='medium'>
                                                                {service.uptime}%
                                                            </Typography>
                                                            <Typography variant='caption' color='text.secondary'>
                                                                Uptime
                                                            </Typography>
                                                        </Box>
                                                    </Grid>

                                                    {/* Status Chip */}
                                                    <Grid>
                                                        <Chip
                                                            label={statusConfig.text}
                                                            // color={statusConfig.chipColor === 'success' ? 'success' : statusConfig.color === 'warning' ? 'warning' : 'error'}
                                                            color={statusConfig.chipColor}
                                                            size='small'
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            {index < category.services.length - 1 && <Divider />}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>
                    ))}
                </Stack>

                {/* Status Legend */}
                <Paper sx={{ mt: 4, p: 3 }} elevation={2}>
                    <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                        Status Legend
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        sx={{ mt: 2 }}
                        flexWrap="wrap"
                    >
                        <Stack direction='row' spacing={1} alignItems='center' sx={{ flex: '1 1 200px' }}>
                            <CheckCircle sx={{ color: 'success.main' }} />
                            <Typography variant='body2'>Operational</Typography>
                        </Stack>
                        <Stack direction='row' spacing={1} alignItems='center' sx={{ flex: '1 1 200px' }}>
                            <Warning sx={{ color: 'warning.main' }} />
                            <Typography variant='body2'>Degraded</Typography>
                        </Stack>
                        <Stack direction='row' spacing={1} alignItems='center' sx={{ flex: '1 1 200px' }}>
                            <Error sx={{ color: 'error.main' }} />
                            <Typography variant='body2'>Partial Outage</Typography>
                        </Stack>
                        <Stack direction='row' spacing={1} alignItems='center' sx={{ flex: '1 1 200px' }}>
                            <Cancel sx={{ color: 'error.dark' }} />
                            <Typography variant='body2'>Major Outage</Typography>
                        </Stack>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};


export default StatusDashboard;