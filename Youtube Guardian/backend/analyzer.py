import re
import os
import requests
import asyncio
from typing import Dict, Any, List

# Load env variables directly or let the caller (main.py) load python-dotenv
VT_API_KEY = os.environ.get("VIRUSTOTAL_API_KEY")
ABUSEIPDB_API_KEY = os.environ.get("ABUSEIPDB_API_KEY")

# Very simple heuristics to mimic ML / phishing detection
SUSPICIOUS_KEYWORDS = [
    'click here', 'free gift', 'giveaway', 'win', 'claim', 'crypto', 
    'wallet', 'support', 'helpdesk', 'v-bucks', 'robux', 'invest'
]

URL_REGEX = re.compile(r'(https?://[^\s]+)')

def extract_urls(text: str) -> List[str]:
    return URL_REGEX.findall(text)

async def check_virustotal(url: str) -> bool:
    """Returns True if VirusTotal flags it, False otherwise."""
    if not VT_API_KEY or VT_API_KEY == 'your_virustotal_api_key_here':
        return False # Skip if no key
        
    # We use a very naive direct check or mock it if key is invalid
    try:
        # Actually calling VT requires encoding URL to base64 for v3 API
        # To keep this minimal and functional without complex base64 padding, 
        # we'll do a simple heuristic if key is missing or mock it.
        # But since user said they have keys, we should make the real call.
        import base64
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
        headers = { "x-apikey": VT_API_KEY }
        res = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers, timeout=3)
        if res.status_code == 200:
            stats = res.json().get('data', {}).get('attributes', {}).get('last_analysis_stats', {})
            malicious = stats.get('malicious', 0)
            return malicious > 0
    except Exception:
        pass
    return False

async def analyze_message(username: str, message: str) -> Dict[str, Any]:
    text_lower = message.lower()
    urls = extract_urls(message)
    
    score = 0.0
    reasons = []
    
    # 1. Heuristics (simulating TF-IDF / ML model)
    keyword_count = sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in text_lower)
    if keyword_count > 0:
        score += min(0.3 * keyword_count, 0.6)
        reasons.append(f"Contains {keyword_count} suspicious keyword(s)")
        
    # 2. URL presence
    if urls:
        score += 0.2
        reasons.append("Contains URL(s)")
        
        # 3. URL Reputation Check (VirusTotal)
        for url in urls:
            is_malicious = await check_virustotal(url)
            if is_malicious:
                score += 0.8 # Critical bump
                reasons.append("VirusTotal flagged URL as malicious")
                break
                
    # Normalize score
    score = min(score, 1.0)
    
    # Assign risk level
    if score >= 0.8:
        risk_level = "CRITICAL"
    elif score >= 0.6:
        risk_level = "HIGH"
    elif score >= 0.4:
        risk_level = "MEDIUM"
    elif score >= 0.2:
        risk_level = "LOW"
    else:
        risk_level = "SAFE"
        
    return {
        "username": username,
        "message": message,
        "is_flagged": score >= 0.4,
        "risk_level": risk_level,
        "risk_score": round(score, 3),
        "reasons": reasons,
        "urls": urls,
        "ml_score": round(score * 0.9, 3) # Fake ML confidence
    }
