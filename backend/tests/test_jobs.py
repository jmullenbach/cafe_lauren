import json

from cafe.jobs import JobContext, Registry, registry

from .conftest import wait_job


def enqueue(app, type_="dummy", payload=None, who="joe"):
    with app.state.db.session() as s:
        job = app.state.jobs.enqueue(s, type_, payload or {}, who)
        return job.id


def events(text):
    out = []
    for block in text.split("\n\n"):
        lines = block.strip().splitlines()
        if any(line == "event: job" for line in lines):
            data = next(line[6:] for line in lines if line.startswith("data: "))
            out.append(json.loads(data))
    return out


def test_dummy_job_runs_to_done(client, app):
    jid = enqueue(app, payload={"result": {"answer": 42}})
    j = wait_job(client, jid)
    assert j["status"] == "done" and j["result"] == {"answer": 42} and j["requested_by"] == "joe"


def test_failed_and_resting(client, app):
    j = wait_job(client, enqueue(app, payload={"fail": "boom"}))
    assert j["status"] == "failed" and "boom" in j["error"]
    j = wait_job(client, enqueue(app, payload={"rest": True}))
    assert j["status"] == "resting" and "resting" in j["error"]


def test_unregistered_type_fails_cleanly_and_retry(client, app):
    jid = enqueue(app, "plan_week")
    j = wait_job(client, jid)
    assert j["status"] == "failed" and "not available yet" in j["error"]
    registry.register("plan_week_test_retry", None)
    # retry after a handler appears (simulates Phase 2 registering one)
    async def ok(ctx: JobContext):
        return {"ran": ctx.type}
    registry.register("plan_week", ok)
    try:
        r = client.post(f"/api/jobs/{jid}/retry").json()
        assert r["status"] == "queued"
        assert wait_job(client, jid)["result"] == {"ran": "plan_week"}
    finally:
        registry.types.pop("plan_week", None)
        registry.types.pop("plan_week_test_retry", None)
    assert client.post(f"/api/jobs/{jid}/retry").status_code == 409


def test_jobs_run_one_at_a_time_in_order(client, app):
    ids = [enqueue(app, payload={"sleep": 0.05, "result": i}) for i in range(3)]
    done = [wait_job(client, i) for i in ids]
    assert [d["result"] for d in done] == [0, 1, 2]
    assert done[0]["updated_at"] <= done[1]["updated_at"] <= done[2]["updated_at"]


def test_sse_stream_gets_job_events(client, app):
    jid = enqueue(app, payload={"sleep": 0.3})
    r = client.get("/api/jobs/stream", params={"max_events": 10, "timeout": 1.5})
    assert r.status_code == 200
    evs = [e for e in events(r.text) if e["id"] == jid]
    assert evs, r.text
    assert evs[-1]["status"] == "done"
    assert {"running", "done"} <= {e["status"] for e in evs}


def test_list_and_get_jobs(client, app):
    jid = enqueue(app, payload={"sleep": 0.2})
    assert any(j["id"] == jid for j in client.get("/api/jobs").json())
    wait_job(client, jid)
    assert client.get("/api/jobs", params={"active": False}).json()[0]["id"] == jid
    assert client.get("/api/jobs/99999").status_code == 404


def test_registry_decorators():
    reg = Registry()

    @reg.handler("x")
    async def h(ctx):
        return 1

    @reg.on_failure("x")
    def f(db, job):
        pass

    assert reg.get("x").handler is h and reg.get("x").on_failure is f
