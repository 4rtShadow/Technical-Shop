import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import secrets

def generate_verification_token():
    return secrets.token_urlsafe(32)

def send_verification_email(email: str, token: str):
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"Email verification would be sent to {email} with token: {token}")
        return True
    
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.EMAILS_FROM_EMAIL
        msg['To'] = email
        msg['Subject'] = "Подтверждение регистрации - TechStore"
        
        verification_url = f"http://localhost:3000/verify-email?token={token}"
        
        body = f"""
        Добро пожаловать в TechStore!
        
        Для завершения регистрации перейдите по ссылке:
        {verification_url}
        
        Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False