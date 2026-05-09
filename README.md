# PhishGuard: Real-Time YouTube Live Chat Threat Detection

## Overview

PhishGuard is a real-time monitoring system designed to detect phishing attempts, malicious links, and spoofing behavior within YouTube live chat environments.

The platform combines machine learning with external threat intelligence services to identify suspicious content and assist moderators in maintaining secure and trustworthy interactions during live streams.

---

## Features

### Real-Time Chat Monitoring
Streams live YouTube chat messages continuously using `pytchat`.

### Machine Learning-Based Detection
Uses a TF-IDF + Logistic Regression model to identify phishing and scam-related patterns in chat messages.

### Threat Intelligence Integration
Integrates external security services for enhanced detection accuracy:
- VirusTotal
- AbuseIPDB

### Flagging and Storage System
Suspicious messages are:
- Flagged in real time
- Stored with metadata
- Available for moderator review

### Moderation Assistance
Tracks repeated suspicious activity and potential offenders within live chat sessions.

---

## System Architecture

```text
YouTube Chat → Message Fetcher → Detection Engine → Database → API Layer → Frontend Dashboard
```

---

## Technology Stack

| Component | Technology |
|----------|------------|
| Backend | FastAPI (Python) |
| Frontend | HTML, CSS, JavaScript |
| Machine Learning | TF-IDF + Logistic Regression |
| APIs | VirusTotal, AbuseIPDB |
| Streaming | pytchat |

---

## Project Structure

```text
project-root/
│
├── backend/
│   ├── main.py
│   ├── analyzer.py
│   ├── database.py
│   ├── youtube.py
│   └── __init__.py
│
├── frontend/
│   └── index.html
│
├── requirements.txt
└── .env
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
```

### 4. Start the Backend Server

```bash
uvicorn backend.main:app --reload
```

### 5. Launch the Frontend

Open:

```text
frontend/index.html
```

in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/analyze` | Analyze a message |
| GET | `/api/flagged` | Retrieve flagged messages |
| GET | `/api/analytics/stats` | Retrieve analytics and statistics |

---

## Testing

### Demo Mode

Use:

```text
demo
```

as the video ID to simulate chat activity without relying on YouTube filtering.

### Swagger API Testing

Access:

```text
http://127.0.0.1:8000/docs
```

to test API endpoints directly.

---

## Limitations

- YouTube may filter certain suspicious messages before they reach the API
- Detection accuracy depends on external threat intelligence databases
- Real-time performance may vary depending on chat volume

---

## Future Improvements

- Transformer-based phishing detection models
- Multi-platform support (Twitch, Discord)
- Advanced analytics dashboard
- Browser extension integration
- Real-time moderation alerts

## License

This project is intended for educational and research purposes.
