<div align="center">

# 🛡️ YouTube Guardian (PhishGuard)

### Real-Time YouTube Live Chat Security Monitor

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![YouTube API](https://img.shields.io/badge/YouTube_Data_API-v3-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://developers.google.com/youtube/v3)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Detect phishing links, scam messages, and malicious content in YouTube live chat — in real time.**

[Live Demo](https://youtube-guardian.netlify.app) · [Report Bug](https://github.com/saturn-16/Youtube-Guardian/issues) · [Request Feature](https://github.com/saturn-16/Youtube-Guardian/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## 🔍 About

YouTube live streams are increasingly targeted by scammers who post phishing links, fake giveaways, and social engineering messages in chat. **YouTube Guardian** monitors live chat in real time, analyzes every message for threats, and flags suspicious activity with risk scores.

The system uses a multi-layered detection engine combining keyword heuristics, URL extraction, and VirusTotal reputation checks to classify messages across four risk levels — from **SAFE** to **CRITICAL**.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Netlify)                        │
│                                                                  │
│   ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│   │  Live Chat   │  │   Flagged    │  │   Top Offenders    │     │
│   │   Monitor    │  │  Messages    │  │     Tracker        │     │
│   └──────┬──────┘  └──────┬───────┘  └────────┬───────────┘     │
│          │                │                    │                  │
│          └────────────────┴────────────────────┘                  │
│                           │                                      │
│                     WebSocket (WSS)                               │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────────┐
│                    BACKEND (HF Spaces)                            │
│                           │                                      │
│                    ┌──────┴──────┐                                │
│                    │   FastAPI   │                                │
│                    │  WebSocket  │                                │
│                    │   Server    │                                │
│                    └──────┬──────┘                                │
│                           │                                      │
│            ┌──────────────┼──────────────┐                       │
│            │              │              │                        │
│     ┌──────┴──────┐ ┌────┴─────┐ ┌──────┴──────┐                │
│     │  YouTube    │ │ Threat   │ │  SQLite     │                 │
│     │  Data API   │ │ Analyzer │ │  Database   │                 │
│     │  v3 Client  │ │  Engine  │ │             │                 │
│     └──────┬──────┘ └────┬─────┘ └─────────────┘                │
│            │             │                                       │
│            │        ┌────┴──────────┐                            │
│            │        │               │                            │
│            │   ┌────┴────┐  ┌──────┴──────┐                     │
│            │   │ Keyword  │  │ VirusTotal  │                     │
│            │   │Heuristics│  │  URL Check  │                     │
│            │   └─────────┘  └─────────────┘                     │
│            │                                                     │
└────────────┼─────────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │  YouTube Live   │
    │  Chat Stream    │
    └─────────────────┘
```

### Data Flow

```
User pastes YouTube URL
        │
        ▼
Frontend extracts Video ID ──► WebSocket ──► Backend receives Video ID
                                                      │
                                                      ▼
                                            YouTube Data API v3
                                            (get liveChatId)
                                                      │
                                                      ▼
                                            Poll live chat messages
                                            (every 5-10 seconds)
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │  Threat Analyzer │
                                            │                 │
                                            │ • Keyword scan  │
                                            │ • URL extraction│
                                            │ • VirusTotal    │
                                            │ • Risk scoring  │
                                            └────────┬────────┘
                                                     │
                                              ┌──────┴──────┐
                                              ▼             ▼
                                          SQLite DB    WebSocket
                                          (persist)    (to frontend)
                                                         │
                                                         ▼
                                                Dashboard updates
                                                in real time
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔴 **Real-Time Monitoring** | Connects to any YouTube live stream and monitors chat messages as they arrive |
| 🎯 **Multi-Layer Detection** | Keyword heuristics + URL extraction + VirusTotal API reputation checks |
| 📊 **Risk Classification** | 4-tier risk scoring: `SAFE` → `LOW` → `MEDIUM` → `HIGH` → `CRITICAL` |
| 🚩 **Flagged Messages Panel** | Instantly highlights suspicious messages with detailed threat reasons |
| 👤 **Top Offenders Tracker** | Identifies repeat offenders posting multiple flagged messages |
| ⚡ **Instant Message Scanner** | Paste any message to analyze it independently without a live stream |
| 📈 **Live Analytics** | Real-time stats: total scanned, flagged count, detection rate, risk breakdown |
| 🔗 **URL Auto-Parsing** | Paste any YouTube URL format — the system auto-extracts the video ID |
| 🎮 **Demo Mode** | Type `demo` as the video ID to test with simulated phishing messages |
| 🌙 **Cyberpunk UI** | Dark theme with scanline effects, glow animations, and glassmorphism |

---

## 🛠 Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance async Python web framework
- **[YouTube Data API v3](https://developers.google.com/youtube/v3)** — Official API for live chat message polling
- **[VirusTotal API](https://www.virustotal.com/)** — URL reputation and malware scanning
- **[SQLite](https://www.sqlite.org/)** — Lightweight embedded database for message persistence
- **[WebSockets](https://websockets.readthedocs.io/)** — Real-time bidirectional communication

### Frontend
- **Vanilla HTML/CSS/JS** — Zero-dependency, no build step required
- **WebSocket Client** — Persistent connection for real-time updates
- **Google Fonts** — JetBrains Mono + Syne typography

### Deployment
- **Backend** → [Hugging Face Spaces](https://huggingface.co/spaces) (Docker)
- **Frontend** → [Netlify](https://netlify.com) (static hosting)

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- [YouTube Data API v3 key](https://console.cloud.google.com/) (free)
- [VirusTotal API key](https://www.virustotal.com/gui/join-us) (free, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saturn-16/Youtube-Guardian.git
   cd Youtube-Guardian
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys:
   ```env
   YOUTUBE_API_KEY=your_youtube_data_api_key
   VIRUSTOTAL_API_KEY=your_virustotal_api_key
   ABUSEIPDB_API_KEY=your_abuseipdb_api_key
   ```

4. **Run the backend**
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

5. **Open the frontend**

   Update `BACKEND_URL` in `frontend/index.html` to `http://localhost:8000`, then open the file in your browser.

6. **Start monitoring**

   Paste any YouTube live stream URL (or type `demo`) and click **▶ MONITOR**.

---

## ☁️ Deployment

### Backend → Hugging Face Spaces

1. Create a new Space on [huggingface.co](https://huggingface.co/new-space) with **Docker** SDK
2. Push the backend code to the Space repo
3. Add `YOUTUBE_API_KEY` as a **Repository Secret** in Space Settings
4. The Space builds and deploys automatically

### Frontend → Netlify

1. Update `BACKEND_URL` in `frontend/index.html` to your HF Space URL
2. Drag & drop the `frontend/` folder on [app.netlify.com](https://app.netlify.com)
3. Done — your frontend is live

---

## 📡 API Reference

### WebSocket — `/ws`

Bidirectional WebSocket for real-time chat monitoring.

**Client → Server:**
```json
{ "action": "start", "video_id": "dQw4w9WgXcQ" }
{ "action": "stop" }
```

**Server → Client:**
```json
{ "type": "status", "data": { "mode": "live" } }
{ "type": "message", "data": { "username": "...", "message": "...", "risk_level": "HIGH", "risk_score": 0.6, "is_flagged": true, "reasons": ["..."] } }
{ "type": "error", "data": { "message": "Error description" } }
```

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/api/chat/analyze` | Analyze a single message |
| `GET` | `/api/flagged/?limit=50` | Get flagged messages |
| `GET` | `/api/analytics/stats` | Get aggregate statistics |

---

## 📁 Project Structure

```
Youtube-Guardian/
├── backend/
│   ├── __init__.py          # Package init
│   ├── main.py              # FastAPI app, WebSocket handler, REST endpoints
│   ├── youtube.py           # YouTube Data API v3 client, URL parser, live chat poller
│   ├── analyzer.py          # Threat detection engine (keywords + VirusTotal)
│   └── database.py          # SQLite persistence layer
├── frontend/
│   └── index.html           # Single-page dashboard (HTML + CSS + JS)
├── Dockerfile               # Container config for backend deployment
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (not committed)
├── .gitignore               # Git ignore rules
├── .dockerignore             # Docker ignore rules
└── README.md                # You are here
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_API_KEY` | ✅ Yes | YouTube Data API v3 key for live chat access |
| `VIRUSTOTAL_API_KEY` | ❌ Optional | Enables URL reputation checks via VirusTotal |
| `ABUSEIPDB_API_KEY` | ❌ Optional | Reserved for future IP reputation features |

> **Note:** Never commit `.env` to version control. The `.gitignore` is configured to exclude it.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for a safer YouTube community**

[⬆ Back to Top](#️-youtube-guardian-phishguard)

</div>
