import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any

# On Render (Linux), use /tmp for writable ephemeral storage
# Locally (Windows), use the project directory
if os.name == 'nt':
    DB_FILE = "phishguard.db"
else:
    DB_FILE = "/tmp/phishguard.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            is_flagged BOOLEAN NOT NULL,
            risk_level TEXT NOT NULL,
            risk_score REAL NOT NULL,
            reasons TEXT,
            urls TEXT
        )
    ''')
    conn.commit()
    conn.close()

def insert_message(msg_data: Dict[str, Any]):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO messages (username, message, timestamp, is_flagged, risk_level, risk_score, reasons, urls)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        msg_data['username'],
        msg_data['message'],
        msg_data.get('timestamp', datetime.utcnow().isoformat()),
        msg_data['is_flagged'],
        msg_data['risk_level'],
        msg_data['risk_score'],
        json.dumps(msg_data.get('reasons', [])),
        json.dumps(msg_data.get('urls', []))
    ))
    conn.commit()
    conn.close()

def get_flagged_messages(limit: int = 50) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM messages 
        WHERE is_flagged = 1 
        ORDER BY timestamp DESC 
        LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        d = dict(row)
        d['reasons'] = json.loads(d['reasons']) if d['reasons'] else []
        d['urls'] = json.loads(d['urls']) if d['urls'] else []
        result.append(d)
    return result

def get_stats() -> Dict[str, Any]:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM messages")
    total_messages = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM messages WHERE is_flagged = 1")
    total_flagged = cursor.fetchone()[0]
    
    cursor.execute("SELECT risk_level, COUNT(*) FROM messages GROUP BY risk_level")
    by_risk = {row[0]: row[1] for row in cursor.fetchall()}
    
    conn.close()
    return {
        "total_messages": total_messages,
        "total_flagged": total_flagged,
        "by_risk": by_risk
    }
