from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Load env vars before importing analyzer
load_dotenv()

from backend.database import init_db, insert_message, get_flagged_messages, get_stats
from backend.analyzer import analyze_message
from backend.youtube import get_live_chat

app = FastAPI(title="PhishGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    chat_task = None
    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")
            
            if action == "start":
                video_id = data.get("video_id", "demo")
                
                # Send status
                mode = "demo" if video_id.lower() == "demo" else "live"
                await websocket.send_json({"type": "status", "data": {"mode": mode}})
                
                if chat_task:
                    chat_task.cancel()
                
                # Start background task to fetch and process chat
                async def process_chat():
                    async for raw_msg in get_live_chat(video_id):
                        analyzed = await analyze_message(raw_msg["username"], raw_msg["message"])
                        analyzed["timestamp"] = datetime.utcnow().isoformat()
                        
                        # Save to DB
                        insert_message(analyzed)
                        
                        # Send to frontend
                        try:
                            await websocket.send_json({"type": "message", "data": analyzed})
                        except Exception:
                            break # Connection closed
                
                chat_task = asyncio.create_task(process_chat())
                
            elif action == "stop":
                if chat_task:
                    chat_task.cancel()
                    
    except WebSocketDisconnect:
        if chat_task:
            chat_task.cancel()

@app.post("/api/chat/analyze")
async def analyze_endpoint(request: Request):
    data = await request.json()
    msg = data.get("message", "")
    username = data.get("username", "TestUser")
    
    result = await analyze_message(username, msg)
    return JSONResponse(content=result)

@app.get("/api/flagged/")
async def flagged_endpoint(limit: int = 50):
    msgs = get_flagged_messages(limit)
    return JSONResponse(content={"items": msgs})

@app.get("/api/analytics/stats")
async def stats_endpoint():
    stats = get_stats()
    return JSONResponse(content=stats)
