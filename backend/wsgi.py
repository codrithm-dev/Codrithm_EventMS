import sys
import os

project_home = '/home/codrithm/ems/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.environ["DATABASE_URL"] = "sqlite+aiosqlite:////home/codrithm/ems/backend/coderithm_events.db"
os.environ["SECRET_KEY"] = "codrithm-dev-2026-secret-key-change-later"
os.environ["DEBUG"] = "False"
os.environ["FRONTEND_URL"] = "https://codrithm.pythonanywhere.com"
os.environ["APP_URL"] = "https://codrithm.pythonanywhere.com"

import asyncio
from concurrent.futures import ThreadPoolExecutor
from wsgiref.util import setup_testing_defaults

_executor = ThreadPoolExecutor(max_workers=1)

from app.main import app

async def call_app(scope, receive, send):
    await app(scope, receive, send)

def application(environ, start_response):
    import io
    setup_testing_defaults(environ)

    method = environ.get("REQUEST_METHOD", "GET")
    path = environ.get("PATH_INFO", "/")
    query = environ.get("QUERY_STRING", "")

    headers = {}
    for key, value in environ.items():
        if key.startswith("HTTP_"):
            headers[key[5:].lower().replace("_", "-")] = value
    if "CONTENT_TYPE" in environ:
        headers["content-type"] = environ["CONTENT_TYPE"]
    if "CONTENT_LENGTH" in environ:
        headers["content-length"] = environ["CONTENT_LENGTH"]

    body = b""
    if "CONTENT_LENGTH" in environ and environ["CONTENT_LENGTH"]:
        length = int(environ["CONTENT_LENGTH"])
        body = environ["wsgi.input"].read(length)

    scope_dict = {
        "type": "http",
        "method": method,
        "path": path,
        "query_string": query.encode(),
        "headers": [(k.encode(), v.encode()) for k, v in headers.items()],
    }

    response_started = False
    response_body = b""
    status_code = 200
    resp_headers = []

    async def send_msg(message):
        nonlocal response_started, response_body, status_code, resp_headers
        if message["type"] == "http.response.start":
            response_started = True
            status_code = message["status"]
            resp_headers = [(k.decode(), v.decode()) for k, v in message.get("headers", [])]
        elif message["type"] == "http.response.body":
            response_body += message.get("body", b"")

    async def receive_msg():
        return {"type": "http.request", "body": body}

    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(call_app(scope_dict, receive_msg, send_msg))
    finally:
        loop.close()

    response_headers = [(k, v) for k, v in resp_headers]
    start_response(f"{status_code} OK", response_headers)
    return [response_body]
