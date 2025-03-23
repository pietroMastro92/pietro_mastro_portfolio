# Email Setup Guide for Portfolio Contact Form

## Gmail Authentication Error

If you're seeing an error like this when trying to send emails from your contact form:

```
Error sending email: Error: Invalid login: 535-5.7.8 Username and Password not accepted.
```

This is because Google has increased security for less secure apps and no longer allows regular passwords for SMTP authentication.

## How to Fix It

### 1. Enable 2-Step Verification

1. Go to your Google Account security settings: https://myaccount.google.com/security
2. Scroll down to "2-Step Verification" and turn it on
3. Follow the prompts to set up 2-Step Verification

### 2. Create an App Password

1. Go to App Passwords: https://myaccount.google.com/apppasswords
   - Note: This option only appears if you have 2-Step Verification enabled
2. Select "Mail" as the app and "Other" as the device (you can name it "Portfolio Website")
3. Click "Generate"
4. Google will display a 16-character password - **copy this password**

### 3. Update Your .env File

1. Open your `.env` file in the project root
2. Update the `EMAIL_PASS` value with the App Password you generated:

```
EMAIL_SERVICE=gmail
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 4. Restart Your Server

After updating the `.env` file, restart your server for the changes to take effect:

```
npm run dev
```

## Additional Notes

- App Passwords are 16-character codes that give less secure apps or devices permission to access your Google Account
- You can revoke App Passwords at any time from your Google Account security settings
- If you change your Google Account password, you'll need to generate a new App Password
- This setup is specifically for Gmail. If you're using another email provider, the configuration may be different