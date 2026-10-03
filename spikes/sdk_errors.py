"""Spike 3: error shapes. Uses an invalid token; real rate-limit can't be forced.
Also contains classify() -- the recipe for resting vs failed."""
import asyncio, time
from _common import setup_env, MODEL
from claude_agent_sdk import (query, ClaudeAgentOptions, ResultMessage, AssistantMessage,
    RateLimitEvent, ClaudeSDKError, ProcessError)
from claude_agent_sdk._errors import ResultError


def classify(assistant_error, rate_limit_events, result, exc) -> str:
    """Return 'ok' | 'resting' | 'auth' | 'failed'."""
    status = getattr(result, "api_error_status", None) or getattr(exc, "api_error_status", None)
    if assistant_error == "rate_limit" or status == 429:
        return "resting"
    if any(e.rate_limit_info.status == "rejected" for e in rate_limit_events):
        return "resting"
    if assistant_error == "authentication_failed" or status in (401, 403):
        return "auth"
    if exc is not None or (result is not None and result.is_error):
        return "failed"
    return "ok"


async def one(label, token):
    setup_env(token)
    opts = ClaudeAgentOptions(model=MODEL, tools=[], max_turns=1, setting_sources=[],
                              system_prompt="Reply with one word.")
    a_err, evs, res, exc = None, [], None, None
    t = time.time()
    try:
        async for m in query(prompt="hi", options=opts):
            if isinstance(m, AssistantMessage):
                a_err = m.error or a_err
                print(" assistant msg error:", m.error, "text:", [getattr(b, "text", None) for b in m.content])
            elif isinstance(m, RateLimitEvent):
                evs.append(m); print(" rate_limit_event:", m.rate_limit_info.status, m.rate_limit_info.rate_limit_type)
            elif isinstance(m, ResultMessage):
                res = m
                print(" result:", dict(subtype=m.subtype, is_error=m.is_error, status=m.api_error_status,
                      terminal=m.terminal_reason, errors=m.errors, result=(m.result or "")[:120]))
    except Exception as e:
        exc = e
        print(" EXC", type(e).__mro__[:3], "|", str(e)[:200],
              "| subtype", getattr(e, "subtype", None), "status", getattr(e, "api_error_status", None),
              "exit", getattr(e, "exit_code", None))
    print(label, "->", classify(a_err, evs, res, exc), f"({time.time()-t:.1f}s)")

async def main():
    await one("bad-token", "sk-ant-oat01-INVALIDINVALIDINVALID")
    await one("good-token", None)   # control: should be ok

asyncio.run(main())
