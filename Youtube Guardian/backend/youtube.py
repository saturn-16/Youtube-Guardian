import asyncio
import pytchat
import random
from typing import AsyncGenerator

# ---------------- MOCK DEMO ---------------- #
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


# ---------------- REAL YOUTUBE CHAT ---------------- #
async def get_live_chat(video_id: str) -> AsyncGenerator[dict, None]:
    if video_id.lower() == "demo":
        async for msg in mock_demo_chat():
            yield msg
        return

    try:
        chat = pytchat.create(video_id=video_id)
        seen_ids = set()   # 🔥 track processed messages

        while chat.is_alive():
            data = chat.get()

            # If no new data, wait a bit
            if not data.items:
                await asyncio.sleep(0.5)
                continue

            for c in data.items:
                # 🔥 Avoid duplicates but DO NOT skip new messages
                if c.id in seen_ids:
                    continue

                seen_ids.add(c.id)

                message_data = {
                    "username": c.author.name,
                    "message": c.message.strip()
                }

                # 🔥 DEBUG (keep this for now)
                print("LIVE MESSAGE:", message_data)

                yield message_data

            # Small delay to prevent overload (NOT too large)
            await asyncio.sleep(0.2)

    except Exception as e:
        print(f"Error connecting to chat: {e}")

        # fallback to demo
        async for msg in mock_demo_chat():
            yield msg