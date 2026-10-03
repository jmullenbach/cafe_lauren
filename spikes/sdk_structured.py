"""Spike 1: structured output."""
import asyncio, json, time
from _common import setup_env, summarize, MODEL
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage, AssistantMessage

SCHEMA = {"type": "object", "properties": {
    "title": {"type": "string"}, "why": {"type": "array", "items": {"type": "string"}},
    "minutes": {"type": "integer"}}, "required": ["title", "why", "minutes"],
    "additionalProperties": False}

async def main():
    setup_env()
    opts = ClaudeAgentOptions(
        model=MODEL, system_prompt="You suggest dinners for a family of 5.",
        tools=[], max_turns=3, setting_sources=[],
        output_format={"type": "json_schema", "schema": SCHEMA})
    t = time.time()
    async for m in query(prompt="Suggest one sheet-pan chicken thigh dinner.", options=opts):
        if isinstance(m, AssistantMessage):
            print("assistant model:", m.model, "error:", m.error)
        if isinstance(m, ResultMessage):
            print("elapsed", round(time.time() - t, 1))
            print(summarize(m))
            print("structured_output:", json.dumps(m.structured_output))
            print("result text:", repr(m.result)[:200])
            print("usage:", m.usage)

asyncio.run(main())
