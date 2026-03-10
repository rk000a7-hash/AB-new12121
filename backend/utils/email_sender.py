import smtplib
from email.message import EmailMessage
from backend.config import Config
def send_email(to_email, subject, message):
    print("Email sending simulated")
    print("To:", to_email)
    print("Subject:", subject)
    print("Message:", message)
    sender_email = Config.GMAIL_SENDER
    sender_password = Config.GMAIL_PASSWORD
    
    if not sender_email or not sender_password:
        print("Email credentials not configured")
        return False
        
    msg = EmailMessage()
    msg.set_content(f"Your OTP for login is: {otp}\nIt is valid for 5 minutes.")
    msg['Subject'] = 'Login OTP - ECommerce'
    msg['From'] = sender_email
    msg['To'] = recipient_email
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False
