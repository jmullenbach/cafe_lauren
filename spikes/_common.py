"""Shared helpers for spikes. Never prints the token."""
import os
from pathlib import Path
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parent.parent
MODEL = "claude-sonnet-5-5"


def setup_env(token: str | None = None) -> None:
    vals = dotenv_values(ROOT / ".env")
    os.environ.pop("ANTHROPIC_API_KEY", None)
    os.environ["CLAUDE_CODE_OAUTH_TOKEN"] = token or vals["CLAUDE_CODE_OAUTH_TOKEN"]


def summarize(msg) -> dict:
    """Safe summary of a ResultMessage (no token)."""
    return dict(subtype=msg.subtype, is_error=msg.is_error, turns=msg.num_turns,
                duration_ms=msg.duration_ms, api_ms=msg.duration_api_ms,
                cost=msg.total_cost_usd, stop=msg.stop_reason,
                terminal=msg.terminal_reason, status=msg.api_error_status)
