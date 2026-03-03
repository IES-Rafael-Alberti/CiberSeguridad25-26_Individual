# Solución: Cross-Site Scripting (XSS)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con un formulario de comentarios vulnerable a XSS. He comprobado que un atacante podía inyectar scripts JavaScript maliciosos que se ejecutaban automáticamente en el navegador de cualquier usuario que visitara la página.

## 2. Código Vulnerable (Original)
El código original mostraba los datos del usuario directamente al enviarlos en la respuesta HTML:

```php
if (isset($_POST['comment'])) {
    echo "Comentario publicado: " . $_POST['comment'];
}
```

Esto permitía enviar `<script>alert('XSS')</script>`, que el navegador interpretaba y ejecutaba.

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he sanitizado todas las salidas al navegador utilizando `htmlspecialchars()`.

1.  **Sanitización de Datos:** Antes de mostrarse en pantalla, proceso la entrada del usuario (`$_POST['comment']`) con esta función para escapar caracteres peligrosos.
2.  **Entidades HTML:** Convierto `<` a `&lt;`, `>` a `&gt;`, `"` a `&quot;`, y `'` a `&#039;`, evitando que el navegador los interprete como etiquetas HTML.
3.  **Encodificación UTF-8:** He especificado explícitamente el charset (`'UTF-8'`).

```php
if (isset($_POST['comment'])) {
    // Sanitizar antes de imprimir
    $comment_safe = htmlspecialchars($_POST['comment'], ENT_QUOTES, 'UTF-8');
    echo "Comentario publicado: " . $comment_safe;
}
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He enviado el formulario con `<script>alert('XSS')</script>`.
2.  He comprobado que el resultado es literalmente el texto del script, no la ejecución del mismo.
3.  He inspeccionado el código fuente de la página y he observado cómo el navegador muestra las entidades (e.g., `&lt;script&gt;`).
