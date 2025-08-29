<?php
// Simple test script to verify contact form functionality
echo "<h2>Testing Contact Form</h2>";

// Test if PHPMailer is available
if (file_exists('vendor/autoload.php')) {
    echo "<p>✅ PHPMailer is available</p>";
} else {
    echo "<p>❌ PHPMailer is not available</p>";
}

// Test if contact.php exists
if (file_exists('forms/contact.php')) {
    echo "<p>✅ Contact form exists</p>";
} else {
    echo "<p>❌ Contact form does not exist</p>";
}

// Test PHP mail function
if (function_exists('mail')) {
    echo "<p>✅ PHP mail() function is available</p>";
} else {
    echo "<p>❌ PHP mail() function is not available</p>";
}

// Test if we can write to contact_log.txt
$test_log = "test_contact.php";
if (file_put_contents('forms/contact_log.txt', $test_log, FILE_APPEND | LOCK_EX)) {
    echo "<p>✅ Can write to log file</p>";
    // Clean up test entry
    file_put_contents('forms/contact_log.txt', '', LOCK_EX);
} else {
    echo "<p>❌ Cannot write to log file</p>";
}

echo "<hr>";
echo "<h3>Next Steps:</h3>";
echo "<p>1. Make sure your web server supports PHP</p>";
echo "<p>2. Test the contact form on your website</p>";
echo "<p>3. Check the contact_log.txt file for any errors</p>";
echo "<p>4. Verify your Gmail app password is correct</p>";
?> 