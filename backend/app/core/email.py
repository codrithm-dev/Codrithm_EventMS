import resend
from app.config import get_settings

settings = get_settings()

if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY


async def send_email(to: str, subject: str, html: str) -> bool:
    if not settings.RESEND_API_KEY:
        print(f"[EMAIL SKIPPED - No API Key] To: {to}, Subject: {subject}")
        return False
    try:
        resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": [to],
            "subject": subject,
            "html": html,
        })
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


def verification_email_html(name: str, token: str) -> str:
    link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    return f"""
    <h2>Welcome to {settings.APP_NAME}!</h2>
    <p>Hi {name},</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="{link}" style="background:#4F46E5;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify Email</a>
    <p>If you didn't create an account, please ignore this email.</p>
    """


def registration_confirmation_html(name: str, event_title: str) -> str:
    return f"""
    <h2>Registration Confirmed</h2>
    <p>Hi {name},</p>
    <p>You have been registered for <strong>{event_title}</strong>.</p>
    <p>You will receive your ticket once your registration is approved.</p>
    """


def registration_approved_html(name: str, event_title: str) -> str:
    return f"""
    <h2>Registration Approved!</h2>
    <p>Hi {name},</p>
    <p>Your registration for <strong>{event_title}</strong> has been approved.</p>
    <p>Your ticket is now available in your dashboard.</p>
    """


def registration_rejected_html(name: str, event_title: str) -> str:
    return f"""
    <h2>Registration Update</h2>
    <p>Hi {name},</p>
    <p>Unfortunately, your registration for <strong>{event_title}</strong> was not approved.</p>
    <p>Please contact the organizer for more details.</p>
    """


def event_reminder_html(name: str, event_title: str, event_date: str) -> str:
    return f"""
    <h2>Event Reminder</h2>
    <p>Hi {name},</p>
    <p>This is a reminder that <strong>{event_title}</strong> is happening on {event_date}.</p>
    <p>We look forward to seeing you there!</p>
    """


def waitlist_promoted_html(name: str, event_title: str) -> str:
    return f"""
    <h2>You're In!</h2>
    <p>Hi {name},</p>
    <p>A spot opened up and you've been promoted from the waitlist for <strong>{event_title}</strong>.</p>
    <p>Your registration is now approved. Check your dashboard for your ticket!</p>
    """
