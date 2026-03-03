<?php
session_start();

// Corrección: Generar un estado aleatorio para prevenir CSRF
if (empty($_SESSION['oauth_state'])) {
    $_SESSION['oauth_state'] = bin2hex(random_bytes(16));
}

$auth_url = "https://github.com/login/oauth/authorize?" . http_build_query([
"client_id" => "Ov23livFnpm90Ii5wxhC",
"client_secret" => "3310dcb82dc5019cf95e2e70727e8b991c840341",
"redirect_uri" => "http://localhost/oauth_callback.php",
"state" => $_SESSION['oauth_state'],
"scope" => "read:user"
]);
header("Location: " . $auth_url);
exit();
