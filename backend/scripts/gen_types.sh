#!/usr/bin/env bash
# Export the OpenAPI document to backend/openapi.json and generate
# frontend/src/api/types.ts from it. Run from anywhere.
set -euo pipefail
BACKEND="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(dirname "$BACKEND")"
cd "$BACKEND"
uv run --quiet python - <<'PY'
import json, tempfile
from pathlib import Path
from cafe.config import Settings
from cafe.main import create_app

tmp = Path(tempfile.mkdtemp())
app = create_app(Settings(_env_file=None, cafe_db_path=tmp / "openapi.db", cafe_media_dir=tmp / "media",
                          cafe_frontend_dist=tmp / "none", cafe_run_migrations=False, cafe_start_worker=False))
Path("openapi.json").write_text(json.dumps(app.openapi(), indent=2, ensure_ascii=False) + "\n")
print("wrote backend/openapi.json")
PY
mkdir -p "$ROOT/frontend/src/api"
cd "$ROOT"
npx --yes openapi-typescript backend/openapi.json -o frontend/src/api/types.ts
