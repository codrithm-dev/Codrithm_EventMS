from app.tasks.celery_app import celery_app
import asyncio


def _run_async(coro):
    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task
def generate_qr_task(registration_id: str):
    from app.database import async_session
    from app.services.ticket_service import generate_ticket_qr

    async def _generate():
        async with async_session() as db:
            await generate_ticket_qr(db, registration_id)
            await db.commit()

    _run_async(_generate())
