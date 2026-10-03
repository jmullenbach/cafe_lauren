"""Spike 4: 3x one-shot query() vs 3 turns on a long-lived ClaudeSDKClient."""
import asyncio, time
from _common import setup_env, MODEL
from claude_agent_sdk import query, ClaudeSDKClient, ClaudeAgentOptions, ResultMessage

OPTS = dict(model=MODEL, tools=[], max_turns=1, setting_sources=[], system_prompt="Reply with one word.")

async def main():
    setup_env()
    for i in range(3):
        t = time.time()
        async for m in query(prompt=f"Say a fruit #{i}", options=ClaudeAgentOptions(**OPTS)):
            pass
        print(f"one-shot {i}: {time.time()-t:.2f}s")
    t0 = time.time()
    async with ClaudeSDKClient(ClaudeAgentOptions(**OPTS)) as c:
        print(f"client connect: {time.time()-t0:.2f}s")
        for i in range(3):
            t = time.time()
            await c.query(f"Say a vegetable #{i}")
            async for m in c.receive_response():
                pass
            print(f"client turn {i}: {time.time()-t:.2f}s")

asyncio.run(main())
