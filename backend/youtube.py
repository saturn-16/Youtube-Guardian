import asyncio
import os
import re
import random
import requests
from typing import AsyncGenerator


class YouTubeChatError(Exception):
    """Raised when we cannot connect to a YouTube live chat."""
    pass


YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"


def extract_video_id(url_or_id: str) -> str:
    """Extract a YouTube video ID from any URL format or return as-is if already an ID.

    Supported formats:
      - https://www.youtube.com/watch?v=VIDEO_ID
      - https://www.youtube.com/live/VIDEO_ID?si=...
      - https://youtu.be/VIDEO_ID
      - https://youtube.com/shorts/VIDEO_ID
      - https://youtube.com/embed/VIDEO_ID
      - Plain VIDEO_ID (11 chars)
    """
    url_or_id = url_or_id.strip()
    if not url_or_id:
        return url_or_id

    # Already a bare video ID (typically 11 alphanumeric/dash/underscore chars)
    if re.fullmatch(r'[a-zA-Z0-9_-]{11}', url_or_id):
        return url_or_id

    # Try to extract from URL patterns
    patterns = [
        r'(?:youtube\.com|youtu\.be)/live/([a-zA-Z0-9_-]{11})',
        r'(?:youtube\.com|youtu\.be)/(?:watch\?.*v=|embed/|shorts/|v/)([a-zA-Z0-9_-]{11})',
        r'youtu\.be/([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)

    # Fallback: return as-is and let the API report the error
    return url_or_id


def _get_live_chat_id(video_id: str) -> str:
    """Fetch the liveChatId for a given YouTube video using the Data API v3."""
    if not YOUTUBE_API_KEY:
        raise YouTubeChatError(
            "YouTube API key is not configured. Set the YOUTUBE_API_KEY environment variable."
        )

    url = f"{YOUTUBE_API_BASE}/videos"
    params = {
        "part": "liveStreamingDetails,snippet",
        "id": video_id,
        "key": YOUTUBE_API_KEY,
    }

    try:
        resp = requests.get(url, params=params, timeout=15)
    except requests.RequestException as e:
        raise YouTubeChatError(f"Failed to reach YouTube API: {e}")

    if resp.status_code == 403:
        error_reason = resp.json().get("error", {}).get("errors", [{}])[0].get("reason", "")
        if "quotaExceeded" in error_reason:
            raise YouTubeChatError("YouTube API daily quota exceeded. Try again tomorrow.")
        raise YouTubeChatError(f"YouTube API access denied: {error_reason}")

    if resp.status_code != 200:
        raise YouTubeChatError(f"YouTube API error (HTTP {resp.status_code}): {resp.text[:200]}")

    data = resp.json()
    items = data.get("items", [])

    if not items:
        raise YouTubeChatError(
            f"Video '{video_id}' not found. Make sure the video ID is correct."
        )

    video = items[0]
    live_details = video.get("liveStreamingDetails", {})
    chat_id = live_details.get("activeLiveChatId")

    if not chat_id:
        title = video.get("snippet", {}).get("title", video_id)
        raise YouTubeChatError(
            f"No active live chat found for '{title}'. "
            f"Make sure the stream is currently LIVE with chat enabled."
        )

    return chat_id


def _fetch_chat_messages(chat_id: str, page_token: str = None) -> dict:
    """Fetch a page of live chat messages."""
    url = f"{YOUTUBE_API_BASE}/liveChat/messages"
    params = {
        "liveChatId": chat_id,
        "part": "snippet,authorDetails",
        "maxResults": 200,
        "key": YOUTUBE_API_KEY,
    }
    if page_token:
        params["pageToken"] = page_token

    try:
        resp = requests.get(url, params=params, timeout=15)
    except requests.RequestException as e:
        raise YouTubeChatError(f"Failed to fetch chat messages: {e}")

    if resp.status_code == 403:
        error_reason = resp.json().get("error", {}).get("errors", [{}])[0].get("reason", "")
        if "quotaExceeded" in error_reason:
            raise YouTubeChatError("YouTube API daily quota exceeded. Try again tomorrow.")
        if "liveChatEnded" in error_reason or "forbidden" in error_reason:
            raise YouTubeChatError("Live chat has ended. The stream may have gone offline.")
        raise YouTubeChatError(f"YouTube API access denied: {error_reason}")

    if resp.status_code != 200:
        raise YouTubeChatError(f"YouTube API error (HTTP {resp.status_code}): {resp.text[:200]}")

    return resp.json()


# ---------------- MOCK DEMO (only when user types "demo") ---------------- #
async def mock_demo_chat() -> AsyncGenerator[dict, None]:
    users = ["CryptoKing", "User123", "AdminSupport", "GamerPro", "RandomViewer", "FreeGiftBot"]
    messages = [
        "Hello stream!",
        "Wow great play",
        "Click here for free V-BUCKS: http://scam.link/vbucks",
        "Can you play another game?",
        "CLAIM your free crypto giveaway at https://phishing.site/claim",
        "lol",
        "Contact me on telegram for support",
        "I love this channel"
    ]

    while True:
        await asyncio.sleep(random.uniform(0.5, 2.0))
        yield {
            "username": random.choice(users),
            "message": random.choice(messages)
        }


# ---------------- REAL YOUTUBE CHAT (via Data API v3) ---------------- #
async def get_live_chat(video_id: str) -> AsyncGenerator[dict, None]:
    # Extract video ID from full YouTube URL if needed
    video_id = extract_video_id(video_id)

    if video_id.lower() == "demo":
        async for msg in mock_demo_chat():
            yield msg
        return

    # Step 1: Get the live chat ID
    print(f"[YouTube API] Fetching live chat ID for video: {video_id}")
    chat_id = _get_live_chat_id(video_id)
    print(f"[YouTube API] Got live chat ID: {chat_id}")

    seen_ids = set()
    page_token = None
    # Skip the first batch (historical messages) to only show new ones
    first_fetch = True

    try:
        while True:
            # Fetch messages from YouTube Data API
            data = _fetch_chat_messages(chat_id, page_token)

            page_token = data.get("nextPageToken")
            # YouTube tells us how long to wait before polling again (in ms)
            poll_interval_ms = data.get("pollingIntervalMillis", 6000)
            poll_interval = max(poll_interval_ms / 1000.0, 3.0)  # At least 3 seconds

            messages = data.get("items", [])

            if first_fetch:
                # Mark all existing messages as seen so we don't replay history
                for msg in messages:
                    seen_ids.add(msg["id"])
                first_fetch = False
                print(f"[YouTube API] Skipped {len(messages)} historical messages. Polling every {poll_interval}s...")
            else:
                for msg in messages:
                    msg_id = msg["id"]
                    if msg_id in seen_ids:
                        continue
                    seen_ids.add(msg_id)

                    snippet = msg.get("snippet", {})
                    author = msg.get("authorDetails", {})

                    # Only process text messages
                    if snippet.get("type") != "textMessageEvent":
                        continue

                    message_data = {
                        "username": author.get("displayName", "Unknown"),
                        "message": snippet.get("textMessageDetails", {}).get("messageText", "").strip()
                    }

                    if message_data["message"]:
                        print("LIVE MESSAGE:", message_data)
                        yield message_data

            # Wait before polling again (respect YouTube's rate limit)
            await asyncio.sleep(poll_interval)

    except YouTubeChatError:
        raise
    except Exception as e:
        raise YouTubeChatError(f"Lost connection to YouTube live chat: {e}")