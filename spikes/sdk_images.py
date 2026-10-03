"""Spike 2: images. (a) base64 blocks via streaming input; (b) Read tool + cwd.
Usage: sdk_images.py <resized_photo.jpg>"""
import asyncio, base64, json, sys, time
from pathlib import Path
from _common import setup_env, summarize, MODEL
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage

SCHEMA = {"type": "object", "properties": {"items": {"type": "array", "items": {
    "type": "object", "properties": {"name": {"type": "string"},
    "confidence": {"type": "string", "enum": ["sure", "unsure"]}},
    "required": ["name", "confidence"]}}}, "required": ["items"]}
SYS = "You read photos of a kitchen pantry/fridge and list visible food items."
photo = Path(sys.argv[1]).resolve()

async def run_a():
    b64 = base64.b64encode(photo.read_bytes()).decode()
    async def stream():
        yield {"type": "user", "message": {"role": "user", "content": [
            {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": b64}},
            {"type": "text", "text": "List the food items you can see."}]},
            "parent_tool_use_id": None}
    opts = ClaudeAgentOptions(model=MODEL, system_prompt=SYS, tools=[], max_turns=3,
        setting_sources=[], output_format={"type": "json_schema", "schema": SCHEMA})
    t = time.time()
    async for m in query(prompt=stream(), options=opts):
        if isinstance(m, ResultMessage):
            print("A elapsed", round(time.time() - t, 1), summarize(m))
            print("A items:", json.dumps(m.structured_output)[:400])

async def run_b():
    opts = ClaudeAgentOptions(model=MODEL, system_prompt=SYS, tools=["Read"],
        allowed_tools=["Read"], cwd=str(photo.parent), max_turns=5, setting_sources=[],
        permission_mode="dontAsk", output_format={"type": "json_schema", "schema": SCHEMA})
    t = time.time()
    async for m in query(prompt=f"Read the image file {photo.name} and list the food items you can see.", options=opts):
        if isinstance(m, ResultMessage):
            print("B elapsed", round(time.time() - t, 1), summarize(m))
            print("B items:", json.dumps(m.structured_output)[:400])
            print("B denials:", m.permission_denials)

asyncio.run(run_a()); asyncio.run(run_b())
