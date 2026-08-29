# 🌱 KrishiMitra — Multi-Intelligence Smart Agriculture Platform

> **One Platform. Smarter Farming. Better Decisions.**  
> A Next-Gen Agriculture Intelligence Ecosystem built for Indian farmers and agricultural workers.

---

## 🚀 Key Features

- 🤖 **AI Crop Advisory & Health**: Personalized agronomy guidance, real-time disease detection, irrigation advice, and telemetry.
- 👷 **Farm Labour & Hiring Portal**: Direct connection between farmers and agricultural workers with instant phone dialer, card-based discovery, and direct hiring workflow.
- 🚜 **Custom Hiring Centre (CHC) Machinery**: Rent tractors, harvesters, drone sprayers, and rotavators with live GPS location & transparent hourly rates.
- 📈 **APMC Market Intelligence**: Real-time mandi rates, 7-day price forecasting, and nearest profitable APMC routing.
- 🏛️ **Government Schemes & Subsidies**: One-click subsidy eligibility calculator and application guides (PM-KISAN, PMFBY, Kusum, etc.).
- 🌐 **Multilingual**: Instant language switching across **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)**.
- 🍃 **MongoDB Atlas + Fallback**: Cloud-backed MongoDB database with local offline persistence.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs, CORS
- **Database**: MongoDB Atlas Cloud Database + JSON Persistence

---

## 🏁 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
JWT_SECRET=krishi-secret-jwt-key-2026-hackathon-secure
MONGODB_URI=your_mongodb_atlas_connection_string
```

Seed initial data into MongoDB Atlas (optional):
```bash
npm run seed:atlas
```

Start the backend server:
```bash
npm run dev
```

The backend will start at `http://localhost:5000`.

---

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 👨‍💻 Project Structure

```
krishi-intelligence/
├── backend/
│   ├── config/            # Database and App Configuration
│   ├── data/              # Seed data and persistent storage
│   ├── models/            # Mongoose Schemas & In-Memory Store
│   ├── routes/            # Express API Endpoints
│   ├── services/          # Business logic & Simulation engine
│   └── server.js          # API entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI & Layout Components
│   │   ├── context/       # Auth, Language & Simulation Contexts
│   │   ├── pages/         # Farmer & Labour Portals
│   │   ├── services/      # Axios/Fetch API client
│   │   └── translations/  # English, Marathi & Hindi dictionaries
│   └── package.json
└── README.md
```

---

## 📜 License
MIT License. Built for Smart India Hackathon & Agri-Tech Innovations.
