from app.repositories import notification_recipient_repository
from app.schemas.notification_recipient import NotificationRecipientCreate, NotificationRecipientUpdate

def create_recipient(recipient: NotificationRecipientCreate):
    existing = notification_recipient_repository.get_recipient_by_email(recipient.email)
    if existing:
        raise ValueError("Recipient with this email already exists")
    
    return notification_recipient_repository.create_recipient(recipient.model_dump())

def get_all_recipients():
    return notification_recipient_repository.get_all_recipients()

def get_active_notification_users():
    users = notification_recipient_repository.get_active_notification_users()
    print(f"Found {len(users)} active users")
    for user in users:
        print(f"- {user.get('name')} ({user.get('email')})")
    return users

def get_recipient_by_id(recipient_id: str):
    recipient = notification_recipient_repository.get_recipient_by_id(recipient_id)
    if not recipient:
        raise ValueError("Recipient not found")
    return recipient

def update_recipient(recipient_id: str, recipient: NotificationRecipientUpdate):
    existing = notification_recipient_repository.get_recipient_by_id(recipient_id)
    if not existing:
        raise ValueError("Recipient not found")
    
    if recipient.email and recipient.email != existing["email"]:
        email_check = notification_recipient_repository.get_recipient_by_email(recipient.email)
        if email_check:
            raise ValueError("Recipient with this email already exists")

    update_data = recipient.model_dump(exclude_unset=True)
    if update_data:
        return notification_recipient_repository.update_recipient(recipient_id, update_data)
    return existing

def delete_recipient(recipient_id: str):
    existing = notification_recipient_repository.get_recipient_by_id(recipient_id)
    if not existing:
        raise ValueError("Recipient not found")
    notification_recipient_repository.delete_recipient(recipient_id)
