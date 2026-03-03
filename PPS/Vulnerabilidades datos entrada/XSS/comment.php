<?php
if (isset($_POST['comment'])) {
    // Sanitización correcta para evitar XSS usando htmlspecialchars
    $comment_safe = htmlspecialchars($_POST['comment'], ENT_QUOTES, 'UTF-8');
    echo "Comentario publicado: " . $comment_safe;
}
?>
<form method="post">
<input type="text" name="comment">
<button type="submit">Enviar</button>
</form>
