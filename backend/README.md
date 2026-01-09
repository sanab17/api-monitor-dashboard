# api-monitor-dashboard
A full-stack API monitoring tool built with React, Node.js, and TypeScript. It periodically checks service health, measures latency, and displays real-time status with error handling and retries.

Features (MVP)
==============

Backend
- Register APIs to monitor
- Periodically ping them
- Track:
    Status (Active / Inactive)
    Response time
    Last checked

Frontend
- List monitored APIs
- Show status badge (🟢 / 🔴)
- Show response time
- Auto-refresh every 10 seconds
