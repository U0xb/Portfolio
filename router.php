<?php
// router.php - Routeur pour serveur PHP intégré

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Si c'est un fichier statique qui existe, le servir
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Si c'est pdf.php
if (preg_match('/^\/pdf\.php/', $uri)) {
    require __DIR__ . '/pdf.php';
    exit;
}

// Sinon servir index.html
if (file_exists(__DIR__ . '/index.html')) {
    require __DIR__ . '/index.html';
} else {
    http_response_code(404);
    echo '404 Not Found';
}
?>
