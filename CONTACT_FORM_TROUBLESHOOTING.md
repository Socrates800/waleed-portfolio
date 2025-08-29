# Contact Form Troubleshooting Guide

## What I Fixed

I've completely rewritten your contact form to resolve the email sending issues. Here's what was wrong and what I fixed:

### ❌ **Original Problems:**
1. **Missing Library**: The original code tried to include a non-existent PHP Email Form library
2. **Broken SMTP**: The SMTP configuration was incomplete and wouldn't work
3. **JavaScript Mismatch**: The validation.js expected "OK" responses but got errors

### ✅ **What I Fixed:**
1. **Installed PHPMailer**: Added proper email library via Composer
2. **Rewrote PHP Script**: Created a working contact.php with proper error handling
3. **Updated JavaScript**: Modified validate.js to handle JSON responses
4. **Added Fallbacks**: Multiple email sending methods for reliability

## How to Test

### 1. **Test the Setup**
Visit: `http://localhost:8000/test_contact.php`
This will show you if all components are working.

### 2. **Test the Form**
Visit: `http://localhost:8000/test_form.html`
This lets you test the actual contact form.

### 3. **Check Logs**
Look for `forms/contact_log.txt` to see if emails are being processed.

## Common Issues & Solutions

### 🔴 **"Failed to send email" Error**
**Cause**: Gmail SMTP settings or app password issues
**Solution**: 
- Verify your Gmail app password is correct
- Check if 2FA is enabled on your Gmail account
- Ensure SMTP is enabled in Gmail settings

### 🔴 **"PHPMailer is not available" Error**
**Cause**: Composer dependencies not installed
**Solution**: Run `composer install` in your project directory

### 🔴 **"Cannot write to log file" Error**
**Cause**: File permissions issue
**Solution**: Check if the `forms/` directory is writable

### 🔴 **Form submits but no email received**
**Cause**: Email might be in spam folder or SMTP configuration issue
**Solution**:
- Check spam/junk folder
- Verify Gmail app password
- Check server error logs

## Gmail Setup Requirements

### 1. **Enable 2-Factor Authentication**
- Go to Google Account settings
- Security → 2-Step Verification → Turn on

### 2. **Generate App Password**
- Go to Google Account settings
- Security → App passwords
- Generate password for "Mail"
- Use this password in contact.php (not your regular Gmail password)

### 3. **Enable "Less secure app access" (if needed)**
- Note: This is deprecated, use app passwords instead

## File Structure
```
your-project/
├── forms/
│   ├── contact.php          ← Updated contact form handler
│   └── contact_log.txt      ← Contact form logs
├── assets/
│   └── vendor/
│       └── php-email-form/
│           └── validate.js  ← Updated JavaScript
├── vendor/                  ← PHPMailer library
├── test_contact.php         ← Test script
└── test_form.html          ← Test form
```

## Testing Steps

1. **Start local server**: `php -S localhost:8000`
2. **Test setup**: Visit `http://localhost:8000/test_contact.php`
3. **Test form**: Visit `http://localhost:8000/test_form.html`
4. **Submit test message**: Fill out and submit the form
5. **Check results**: Look for success/error messages
6. **Check email**: Check your Gmail inbox (and spam folder)

## Production Deployment

When deploying to production:

1. **Update email settings** in `forms/contact.php`
2. **Use production SMTP** credentials
3. **Set proper file permissions**
4. **Test thoroughly** before going live

## Need More Help?

If you're still having issues:

1. Check the browser console for JavaScript errors
2. Look at the PHP error logs
3. Verify the contact_log.txt file contents
4. Test with a different email service (like SendGrid)

## Security Notes

- ✅ **Input validation** is implemented
- ✅ **CSRF protection** can be added if needed
- ✅ **Rate limiting** can be implemented
- ⚠️ **Gmail app passwords** should be kept secure
- ⚠️ **Log files** should be protected from public access 