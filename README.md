# API Monitor Dashboard

A production-ready full-stack application for monitoring API health, tracking response times, and visualizing service status in real-time.

## Live Demo
- Frontend: https://api-monitor-dashboard.netlify.app/
- Backend: https://api-monitor-dashboard-6ah2.onrender.com/api/monitor

✨ Features
Core Functionality

🔄 Real-time Monitoring - Automated health checks every 15 seconds
📊 Performance Tracking - Response time measurement and visualization
⚡ Status Dashboard - Live status updates (UP/DOWN) for monitored APIs
🎯 Custom Endpoints - Add and monitor multiple API endpoints
🔔 Visual Indicators - Color-coded status (green for UP, red for DOWN)

Technical Highlights

✅ Full TypeScript implementation for type safety
✅ RESTful API architecture
✅ Responsive React frontend
✅ Express.js backend with structured routing
✅ Error handling and retry mechanisms
✅ CI/CD deployment pipeline

🛠️ Tech Stack

Frontend

React 18 with TypeScript
Vite for fast build tooling
CSS3 for styling
Fetch API for HTTP requests

Backend

Node.js runtime
Express.js web framework
TypeScript for type safety
CORS for cross-origin requests

DevOps

Netlify - Frontend hosting
Render - Backend hosting
Git - Version control
npm - Package management

🚀 Getting Started

Prerequisites
node >= 18.0.0
npm >= 9.0.0

Installation

1. Clone the repository
git clone https://github.com/sanab17/api-monitor-dashboard.git
cd api-monitor-dashboard

2. Install Backend Dependencies
cd backend
npm install

3. Install Frontend Dependencies
cd ../frontend
npm install

4. Set up Environment Variables
Create .env files in both frontend and backend:

Frontend .env:
VITE_API_BASE_URL=http://localhost:3000

Backend .env:
PORT=3000

5. Run Development Servers

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
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic
│   │   ├── app.ts          # Express app configuration
│   │   ├── server.ts       # Server startup
│   │   └── index.ts        # Entry point
│   ├── tests/              # Backend tests
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main component
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── README.md

🧪 Testing

Run Backend Tests:
cd backend
npm test

🌐 Deployment

Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Set build command: npm run build
3. Set publish directory: dist
4. Add environment variable: VITE_API_BASE_URL=https://api-monitor-dashboard-6ah2.onrender.com

Backend (Render)

1. Connect your GitHub repository to Render
2. Set build command: npm install && npm run build
3. Set start command: npm start
4. Add environment variable: PORT=3000

📝 API Documentation

Endpoints

Get All Monitors
GET /api/monitor

Response:
[
  {
    "name": "Example API",
    "url": "https://api.example.com",
    "status": "UP",
    "responseTimeMs": 145,
    "lastChecked": "2026-01-30T08:00:00Z"
  }
]

Add New Monitor
POST /api
Content-Type: application/json

Request Body:
{
  "name": "My API",
  "url": "https://api.myservice.com",
  "description": "Production API endpoint"
}

Response:
{
  "name": "My API",
  "url": "https://api.myservice.com",
  "status": "PENDING",
  "lastChecked": null
}

🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

🐛 Known Issues & Future Enhancements

- Add authentication for protected endpoints
- Implement data persistence (database integration)
- Add email/SMS notifications for downtime
- Create historical data visualization charts
- Add support for custom monitoring intervals
- Implement webhook notifications

👤 Author
Sana Bulbule

GitHub: @sanab17
LinkedIn: https://www.linkedin.com/in/sanabulbule/

🙏 Acknowledgments

Built with modern web technologies
Inspired by the need for simple, effective API monitoring
Thanks to the open-source community

<div align="center">
⭐ Star this repository if you find it helpful!
Made with ❤️ by Sana Bulbule
</div>
