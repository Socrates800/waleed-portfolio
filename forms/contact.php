<?php
// Set headers for AJAX requests
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Your receiving email address
$receiving_email = 'haiderwaleed81@gmail.com';

// Try to send email using PHPMailer first
$mail_sent = sendEmailViaPHPMailer($receiving_email, $subject, $message, $name, $email);

if ($mail_sent) {
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully!'
    ]);
} else {
    // If PHPMailer fails, try PHP's mail() function as fallback
    $fallback_sent = sendEmailViaPHP($receiving_email, $subject, $message, $name, $email);
    
    if ($fallback_sent) {
        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to send email. Please try again later or contact us directly.'
        ]);
    }
}

// Log the contact attempt (optional)
$log_entry = date('Y-m-d H:i:s') . " - Contact from: {$name} ({$email}) - Subject: {$subject}\n";
file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);

/**
 * Send email using PHPMailer with SMTP
 */
function sendEmailViaPHPMailer($to, $subject, $message, $from_name, $from_email) {
    try {
        // Check if PHPMailer is available
        if (!file_exists('../vendor/autoload.php')) {
            return false;
        }
        
        require '../vendor/autoload.php';
        
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'haiderwaleed81@gmail.com';
        $mail->Password = 'ehsp hqct dkrk oiqs'; // Your Gmail app password
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Recipients
        $mail->setFrom('haiderwaleed81@gmail.com', 'Portfolio Contact Form');
        $mail->addAddress($to);
        $mail->addReplyTo($from_email, $from_name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "Portfolio Contact: " . $subject;
        
        $email_content = "
        <html>
        <head>
            <title>New Contact Form Submission</title>
        </head>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {$from_name}</p>
            <p><strong>Email:</strong> {$from_email}</p>
            <p><strong>Subject:</strong> {$subject}</p>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
            <hr>
            <p><small>This email was sent from your portfolio contact form.</small></p>
        </body>
        </html>
        ";
        
        $mail->Body = $email_content;
        $mail->AltBody = strip_tags(str_replace('<br>', "\n", $email_content));
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        // Log error for debugging
        error_log("PHPMailer Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Fallback email function using PHP's mail()
 */
function sendEmailViaPHP($to, $subject, $message, $from_name, $from_email) {
    // Email headers
    $headers = array(
        'From: ' . $from_name . ' <' . $from_email . '>',
        'Reply-To: ' . $from_email,
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/html; charset=UTF-8'
    );

    // Email content
    $email_content = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
    </head>
    <body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {$from_name}</p>
        <p><strong>Email:</strong> {$from_email}</p>
        <p><strong>Subject:</strong> {$subject}</p>
        <p><strong>Message:</strong></p>
        <p>" . nl2br(htmlspecialchars($message)) . "</p>
        <hr>
        <p><small>This email was sent from your portfolio contact form.</small></p>
    </body>
    </html>
    ";

    return mail($to, "Portfolio Contact: " . $subject, $email_content, implode("\r\n", $headers));
}
?>
