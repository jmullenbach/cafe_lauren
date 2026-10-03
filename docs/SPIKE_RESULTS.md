# Phase 0 spike results

Run on a Mac, 2026-10-03, `claude-agent-sdk` 0.2.163 (bundled CLI), Python 3.12 via uv. Scripts are in `spikes/`. Run any of them with
`uv run --python 3.12 --with claude-agent-sdk --with python-dotenv python spikes/<name>.py`.
Pi timings will be slower than the ones below.

| # | Unknown | Answer | Status |
|---|---|---|---|
| 1 | Structured output | `ClaudeAgentOptions(output_format={"type":"json_schema","schema":{...}})`; parsed dict is `ResultMessage.structured_output`. `model="claude-sonnet-5-5"` works. Needs `max_turns >= 3` (it takes 2 turns). | settled |
| 2 | Images | Both routes work. Base64 blocks via streaming input were faster and cheaper (7.6 s, $0.19 vs 9.9 s, $0.47). Use base64; no `Read` tool needed, so the no-tools lockdown holds. | settled |
| 3 | Limit errors | Real limit not forceable. Failures arrive as an `AssistantMessage.error` literal plus a `ResultMessage` with `is_error` and `api_error_status`, then a `ResultError` raised at end of iteration. A `RateLimitEvent` stream gives early warning. Recipe below; bad token verified as `authentication_failed`/401. | settled for auth shape; the `rate_limit`/429 branch is unverified live |
| 4 | Cold start | One-shot `query()` 1.5 to 2.2 s per trivial call; long-lived `ClaudeSDKClient` 0.3 s connect then about 0.9 s per turn. Saves about 1 s per call on the Mac. | settled (Mac only) |
| 5 | Ad fetch | `scripts/fetch_ads.py` still finds 4 Cermak ad images (`Cermak4_N_092426.jpg`), 3.6 s total. | settled |
| 6 | Instacart dev links and retailer keys | `spikes/instacart_spike.py` written and syntax-checked, not run. | pending: no key |

## 1. Structured output

```python
opts = ClaudeAgentOptions(
    model="claude-sonnet-5-5", system_prompt="...", tools=[], max_turns=3,
    setting_sources=[],
    output_format={"type": "json_schema", "schema": SCHEMA})
async for m in query(prompt="...", options=opts):
    if isinstance(m, ResultMessage):
        data = m.structured_output      # already a dict; validate with Pydantic
```

- The same JSON is also in `m.result` as a string, but use `structured_output`.
- Structured output is delivered via an internal tool call, so `num_turns` was 2 and `stop_reason` was `tool_use` on a successful run. With `max_turns=1` expect `error_max_turns`.
- `AssistantMessage.model` reported `claude-sonnet-5-5`. Cost for a small call was about $0.008 (reported even on subscription), 6.8 s wall, of which about 3.5 s API time.
- `setting_sources=[]` plus `tools=[]` kept the call isolated from the repo's CLAUDE.md and settings.

## 2. Images

(a) Base64 content blocks, streaming input. Works.

```python
b64 = base64.b64encode(path.read_bytes()).decode()
async def stream():
    yield {"type": "user", "parent_tool_use_id": None, "message": {"role": "user", "content": [
        {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": b64}},
        {"type": "text", "text": "List the food items you can see."}]}}
async for m in query(prompt=stream(), options=opts):   # opts as in section 1, tools=[]
    ...
```

(b) `tools=["Read"]`, `allowed_tools=["Read"]`, `cwd=<photo dir>`, `permission_mode="dontAsk"`, prompt names the file. Also works, no permission denials, but costs an extra turn.

| Route | Wall | API ms | Turns | Cost | Quality |
|---|---|---|---|---|---|
| (a) base64 | 7.6 s | 6.7 s | 2 | $0.19 | similar |
| (b) Read | 9.9 s | 9.3 s | 3 | $0.47 | similar |

Test photo: a PXL freezer shot resized to 1024 px with `sips -Z 1024` (about 2.4 MB original). Both identified the same main items (chicken thighs, ice cream, frozen greens, meatballs) with slightly different confidence labels.
Gotchas: the dict for a streamed user message needs `"type": "user"` and `parent_tool_use_id`; resize first (originals are 2 to 3 MB). Cost is higher than text because of image tokens, so batch photos per call only if quota allows. Image calls with a Read route need no extra settings, but base64 keeps `tools=[]`.

## 3. Limit errors

SDK surfaces (from `types.py` and `_errors.py`, confirmed by a bad-token run):

- `AssistantMessage.error`: one of `authentication_failed | billing_error | rate_limit | invalid_request | server_error | unknown`.
- `ResultMessage`: `is_error`, `subtype`, `api_error_status` (HTTP code such as 401, 429, 529), `terminal_reason` (`api_error`, `max_turns`, `completed`), `result` holds the "API Error: ..." prose.
- `RateLimitEvent.rate_limit_info`: `status` (`allowed | allowed_warning | rejected`), `rate_limit_type` (`five_hour | seven_day | ...`), `resets_at` (unix), `utilization`. A normal call emitted `allowed five_hour`.
- Exceptions: after the failing `ResultMessage` is yielded, the iterator raises `ResultError` (subclass of `ProcessError`, `ClaudeSDKError`) with `.subtype`, `.api_error_status`, `.terminal_reason`, `.result`.

Observed with an invalid token (3.1 s): AssistantMessage text "Failed to authenticate. API Error: 401 OAuth access token is invalid.", `error="authentication_failed"`, ResultMessage `subtype="success"`, `is_error=True`, `api_error_status=401`, `terminal_reason="api_error"`, then `ResultError` raised (exit code 1). Note `subtype` is still `"success"`, so check `is_error`, not `subtype`.

Detection recipe (`classify` in `spikes/sdk_errors.py`):

```python
def classify(assistant_error, rate_limit_events, result, exc):
    status = getattr(result, "api_error_status", None) or getattr(exc, "api_error_status", None)
    if assistant_error == "rate_limit" or status == 429: return "resting"
    if any(e.rate_limit_info.status == "rejected" for e in rate_limit_events): return "resting"
    if assistant_error == "authentication_failed" or status in (401, 403): return "auth"   # health: token rejected
    if exc is not None or (result and result.is_error): return "failed"
    return "ok"
```

Collect `assistant_error`, `RateLimitEvent`s and the `ResultMessage` inside the loop, wrap the loop in `try/except Exception as exc`, then classify. Store `resets_at` from the rejected event to show when Cafe will be back. The 429/`rate_limit` branch is inferred from the types and not seen live; treat any unrecognised error as `failed` with the `result` text.

## 4. Cold start

| Mode | Timings (s) |
|---|---|
| one-shot `query()` x3 | 2.23, 1.55, 2.09 |
| `ClaudeSDKClient`, connect | 0.30 |
| `ClaudeSDKClient`, turns x3 | 0.92, 0.88, 1.03 |

The CLI subprocess start is about 1 s per one-shot call on the Mac. Against 7 to 10 s real calls this is minor. Recommendation: use one-shot `query()` (isolated, no state, and the per-call options differ by task); a long-lived client is only worth it for the chat feature. Expect the Pi to roughly double the overhead. Re-measure there.

## 5. Ad fetch

`scripts/fetch_ads.py` run with `uv run --python 3.12 --with requests --with beautifulsoup4 --with python-dotenv`. Found and downloaded 4 images (`Cermak4_1..4_092426.jpg`) from `https://www.cermakproduce.com/weekly-ads/`. It replaced the previous images in `images/ads/` (gitignored, not committed).

## 6. Instacart (pending: no key)

`spikes/instacart_spike.py` posts three items to `https://connect.dev.instacart.tools/idp/v1/products/products_link`, prints `products_link_url`, prints candidate `?retailer_key=` URLs, and tries a retailers lookup. Once `INSTACART_API_KEY` is in `.env`, run it, open the URL on a phone, and record: (1) whether the dev link opens the real marketplace with a usable cart, (2) the working retailer keys for Cermak Produce and Aldi (the keys in the script are guesses).
