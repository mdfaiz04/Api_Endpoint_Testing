import os
import logging
import resend
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

def send_email_via_resend(to_address: str, subject: str, html_content: str):
    """
    Sends an email using the Resend API.
    Exceptions are caught and logged to prevent application crashes.
    """
    # Fetch API key dynamically in case dotenv is loaded after module import
    resend.api_key = os.environ.get("RESEND_API_KEY")
    
    if not resend.api_key:
        logger.error("RESEND_API_KEY environment variable is not set. Email will not be sent.")
        return

    # Use a configured "from" address or default to Resend's testing domain
    from_email = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    try:
        logger.info(f"Attempting to send email to {to_address} via Resend. Subject: {subject}")
        response = resend.Emails.send({
            "from": from_email,
            "to": to_address,
            "subject": subject,
            "html": html_content
        })
        logger.info(f"Email sent successfully! Resend Response ID: {response.get('id', 'unknown')}")
        return response
    except Exception as e:
        logger.error(f"Failed to send email via Resend: {e}", exc_info=True)
        return None

def verify_resend_configuration():
    """
    A standalone verification method to send a test email without running an API test.
    Useful for validating API key and deliverability.
    """
    api_key_loaded = os.environ.get("RESEND_API_KEY") is not None
    from_email_loaded = os.environ.get("RESEND_FROM_EMAIL")
    test_recipient = os.environ.get("RESEND_TEST_RECIPIENT")
    
    print(f"DEBUG: RESEND_API_KEY loaded: {api_key_loaded}")
    print(f"DEBUG: RESEND_FROM_EMAIL loaded: {from_email_loaded}")
    print(f"DEBUG: RESEND_TEST_RECIPIENT loaded: {test_recipient}")

    if not test_recipient:
        print("Set RESEND_TEST_RECIPIENT environment variable to run this verification.")
        return

    print("Sending verification email...")
    result = send_email_via_resend(
        to_address=test_recipient,
        subject="Resend Configuration Verification",
        html_content="<p>If you are reading this, the Resend integration is working correctly!</p>"
    )
    if result:
        print(f"Verification successful. Response: {result}")
    else:
        print("Verification failed. Check your logs for details.")

if __name__ == "__main__":
    # Configure simple console logging when run directly
    logging.basicConfig(level=logging.INFO)
    verify_resend_configuration()
