# 🛡️ YouTube Guardian

**Real-Time YouTube Live Chat Security Monitor**

YouTube Guardian monitors live chat feeds during streams, analyzing every message in real time to detect phishing links, malicious spam, impersonation attempts, and suspicious behavior before they reach your audience.

* **Live Frontend:** [https://youtube-guardian-ofrv.vercel.app/](https://youtube-guardian-ofrv.vercel.app/)
* **Live API Backend:** [https://saturn-16-youtube-guardian.hf.space](https://saturn-16-youtube-guardian.hf.space)

---

## 🚀 Key Features

* 🔴 **Real-Time Monitoring**: Establishes a WebSocket connection to monitor YouTube Live streams dynamically.
* 🎯 **Multi-Layer Threat Analysis**: Combines keyword heuristics and VirusTotal URL reputation checks.
* 📊 **Cyberpunk Analytics Dashboard**: Includes a live threat panel, repeat offenders tracker, real-time message scanning telemetry, and an on-demand message analyzer.
* 🛡️ **Session-Secured Access**: Integrates Google and GitHub Authentication with session-only persistence (automatic logout when the browser tab is closed).
* ✨ **Interactive UI/UX**: Built with WebGL-powered aurora backgrounds, responsive threat orbiting cards, glitched title typography, and dynamic hover proximity font weights.

---

## 🛠 Tech Stack

### Frontend
* **Core**: React 18 & Vite
* **Styling**: Vanilla CSS, Orbitron & JetBrains Mono typography
* **Animations**: Motion (Framer Motion), GSAP ScrollTrigger, and WebGL (OGL)
* **Auth**: Firebase Authentication (Google & GitHub)

### Backend
* **Core**: FastAPI (Python 3.11+)
* **APIs**: YouTube Data API v3, VirusTotal API
* **Database**: SQLite (SQLAlchemy) for message persistence
* **WebSockets**: Real-time async updates

---

## 💻 Local Development

### 1. Backend Setup
1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/saturn-16/Youtube-Guardian.git
   cd Youtube-Guardian
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables in a `.env` file in the root:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key
   VIRUSTOTAL_API_KEY=your_virustotal_api_key
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Add your Firebase web app configuration in a `.env.local` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## ☁️ Deployment

* **Backend**: Deployed on **Hugging Face Spaces** using the provided `Dockerfile`.
* **Frontend**: Deployed on **Vercel** with SPA rewrites configured in `vercel.json`.

---

## 📁 Project Structure

```
Youtube-Guardian/
├── backend/
│   ├── main.py              # FastAPI application, WebSocket, & endpoints
│   ├── youtube.py           # YouTube Data API client & live chat poller
│   ├── analyzer.py          # Threat analysis engine (Keywords + VirusTotal)
│   └── database.py          # SQLite database connection & models
├── frontend/
│   ├── vercel.json          # Vercel deployment rewrites config
│   ├── vite.config.js       # Vite configuration
│   ├── package.json         # Node scripts & dependencies
│   ├── index.html           # Main HTML template & tab assets
│   └── src/                 # React components, pages, & auth context
├── Dockerfile               # Backend Docker container configuration
└── requirements.txt         # Python dependencies
```

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
