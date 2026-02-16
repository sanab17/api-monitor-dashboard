# API Monitor Dashboard

A production-ready full-stack application for monitoring API health, service status, and performance metrics. Built with modern technologies and deployed on cloud infrastructure.

## Live Demo
- Frontend: https://api-monitor-dashboard.netlify.app/
- Backend: https://api-monitor-dashboard-6ah2.onrender.com/api/monitor

✨ Features
Core Functionality

🔄 Real-time Monitoring - Automated health checks every 15 seconds
📊 Performance Tracking - Response time tracking and uptime calculations
🎯 Multi-Service Support - Monitor multiple APIs and services simultaneously
🏷️ Service Categorization - Organize services by type (Core, API, Infrastructure)
🔔 Status Indicators - Visual health status (Operational, Degraded, Partial Outage, Major Outage)

Technical Highlights

✅ Full TypeScript - End-to-end type safety
✅ Material-UI Design - Professional, enterprise-grade UI components
✅ RESTful API - Clean, well-structured backend architecture
✅ Incident Tracking - Automatic detection and logging of service issues
✅ CORS Configured - Secure cross-origin resource sharing
✅ Error Handling - Robust error management and retry mechanisms
✅ Responsive Design - Works seamlessly on desktop, tablet, and mobile

DevOps

🚀 CI/CD Pipeline - Automated deployments
☁️ Cloud Hosted - Frontend on Netlify, Backend on Render
📈 Scalable Architecture - Ready for production workloads

🛠️ Tech Stack

Frontend

React 18 for UI framework
TypeScript for Type safety and better DX
Material-UI (MUI) for component library and design system
Vite for fast build tool and dev server
CSS3 for styling
Fetch API for HTTP requests

Backend

Node.js for runtime environment
Express.js for web framework
TypeScript for type-safe backend code
Axios for HTTP client for health checks
CORS for cross-origin security

DevOps & Deployment

Netlify - Frontend hosting with automatic deployments
Render - Backend hosting with automatic deployments
Git/GitHub - Version control and CI/CD triggers
npm - Package management

🚀 Getting Started

Prerequisites
node >= 18.0.0
npm >= 9.0.0

Installation & Setup

1. Clone the repository
git clone https://github.com/sanab17/api-monitor-dashboard.git
cd api-monitor-dashboard

2. Backend Setup
cd backend
npm install

# Create .env file
echo "PORT=3000" > .env

# Start development server
npm run dev

Backend will run on http://localhost:3000

Test the backend:
curl http://localhost:3000/health
curl http://localhost:3000/api/dashboard/services

3. Frontend Setup
cd frontend
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:3000" > .env

# Start development server
npm run dev

Frontend will run on http://localhost:5173

4. Run Development Servers

Terminal 1 - Backend:
cd backend
npm run dev

Terminal 2 - Frontend:
cd frontend
npm run dev

6. Access the Application
* Frontend: http://localhost:5173
* Backend: http://localhost:3000

📁 Project Structure

api-monitor-dashboard/
├── backend/
│   ├── src/
│   │   ├── types/
│   │   │   └── service.ts          # TypeScript type definitions
│   │   ├── services/
│   │   │   ├── serviceStore.ts     # In-memory data store
│   │   │   └── healthCheckService.ts # Health monitoring logic
│   │   ├── routes/
│   │   │   └── dashboardRoutes.ts  # API endpoints
│   │   ├── app.ts                  # Express app configuration
│   │   ├── server.ts               # Server startup
│   │   └── index.ts                # Entry point
│   ├── tests/
│   │   └── index.spec.ts           # Backend tests
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── StatusDashboard.tsx # Main dashboard component
│   │   ├── api/
│   │   │   └── dashboardApi.ts     # API client
│   │   ├── types/
│   │   │   └── service.ts          # TypeScript types
│   │   ├── App.tsx                 # Root component
│   │   └── main.tsx                # Entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── README.md

🌐 API Documentation

Base URL

Development: http://localhost:3000
Production: https://api-monitor-dashboard-6ah2.onrender.com

Endpoints

Get Dashboard Summary
GET /api/dashboard/summary

Response:
{
  "totalServices": 4,
  "operationalServices": 2,
  "degradedServices": 1,
  "outageServices": 1,
  "activeIncidents": 2,
  "overallStatus": "degraded"
}

Get All Services
GET /api/dashboard/services

Response:
[
  {
    "category": "Core Services",
    "services": [
      {
        "id": "1",
        "name": "User Authentication",
        "status": "operational",
        "uptime": 99.99,
        "responseTimeMs": 45,
        "lastChecked": "2026-01-30T08:00:00Z"
      }
    ]
  }
]

Get Active Incidents
GET /api/dashboard/incidents?active=true

Response:
[
  {
    "id": "1",
    "serviceName": "Payment Processing",
    "severity": "degraded",
    "message": "Experiencing increased latency",
    "status": "investigating",
    "startedAt": "2026-01-30T07:30:00Z"
  }
]

Add New Service
POST /api/dashboard/services
Content-Type: application/json

Request Body:
{
  "name": "My API",
  "category": "API Services",
  "url": "https://api.example.com/health",
  "description": "My API endpoint"
}

🧪 Testing

Backend Tests:
cd backend
npm test

Frontend Tests
cd frontend
npm test

🌐 Deployment

Frontend (Netlify)

1. Connect Repository
- Log in to Netlify
- New site from Git → Select api-monitor-dashboard


2. Build Settings
- Base directory: frontend
- Build command: npm run build
- Publish directory: frontend/dist

3. Environment Variables
- VITE_API_BASE_URL=https://api-monitor-dashboard-6ah2.onrender.com

4. Deploy
- Click "Deploy site"
- Auto-deploys on every push to main

Backend (Render)

1. Connect Repository
- Log in to Render
- New Web Service → Connect api-monitor-dashboard

2. Build Settings
- Root directory: backend
- Build command: npm install && npm run build
- Start command: npm start

3. Environment Variables
- PORT=3000
- NODE_ENV=production

4. Deploy
- Click "Create Web Service"
- Auto-deploys on every push to main

🔧 Configuration

Adding New Services to Monitor
Edit backend/src/services/serviceStore.ts:
const sampleServices: Service[] = [
  {
    id: '1',
    name: 'Your Service Name',
    category: 'Your Category',
    url: 'https://your-service.com/health',
    description: 'Service description',
    status: ServiceStatus.OPERATIONAL,
    uptime: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Add more services...
];

Customizing Health Check Interval
Edit backend/src/services/healthCheckService.ts:
private checkInterval: number = 15000; // Change to desired interval (ms)

Customizing Theme Colors
Edit frontend/src/App.tsx:
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    // ... other customizations
  },
});

🐛 Troubleshooting

Services Not Showing
1. Check browser console for errors (F12)
2. Verify VITE_API_BASE_URL is set correctly in Netlify
3. Check backend is running: curl https://api-monitor-dashboard-6ah2.onrender.com/health
4. Verify CORS allows your frontend domain

CORS Errors
Update backend/src/app.ts:
app.use(cors({
  origin: ['https://your-netlify-domain.netlify.app'],
  credentials: true
}));

Build Errors

Clear node_modules: rm -rf node_modules && npm install
Clear build cache: rm -rf dist && npm run build

🗺️ Roadmap / Future Enhancements

Add authentication for admin panel
Implement database persistence (PostgreSQL/MongoDB)
Add email/SMS notifications for incidents
Historical data visualization with charts
Support for custom health check intervals per service
Webhook notifications
Public status page (read-only view)
Performance metrics dashboard
SLA tracking and reporting

🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

Please ensure:

Code follows existing style
All tests pass
Add tests for new features
Update documentation as needed

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👤 Author
Sana Bulbule

GitHub: @sanab17
LinkedIn: https://www.linkedin.com/in/sanabulbule/

🙏 Acknowledgments

Built with Material-UI for the component library
Inspired by industry-standard status pages like Atlassian Status
Thanks to the open-source community

<div align="center">
⭐ Star this repository if you find it helpful!
Made with ❤️ and ☕ by Sana Bulbule
 
· Report Bug / Request Feature: https://github.com/sanab17/api-monitor-dashboard/issues

</div>
