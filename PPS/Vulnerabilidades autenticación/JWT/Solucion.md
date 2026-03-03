# Solución: Manipulación de JWT (Clave Débil)

## 1. Explicación de la Actividad
En esta actividad, he analizado un script (`jwt_weak.php`) que generaba JSON Web Tokens (JWT) para la autenticación. He identificado que la vulnerabilidad principal residía en el uso de una clave secreta extremadamente débil y predecible ("example_key") para firmar los tokens. Esto permitía a un atacante realizar un ataque de fuerza bruta offline para descubrir la clave y posteriormente forjar tokens falsos con privilegios elevados (por ejemplo, cambiando el rol de "user" a "admin").

## 2. Código Vulnerable (Original)
El código original utilizaba una clave "hardcodeada" y simple, lo que compromete la integridad de la firma:

```php
$key = hash("sha256", "example_key"); // Clave débil y predecible
$jwt = JWT::encode($payload, $key, "HS256");
```

## 3. Corrección Aplicada
Para asegurar la implementación, he sustituido la clave débil por una **clave secreta fuerte, larga y compleja**.

*   **Complejidad:** La nueva clave incluye caracteres alfanuméricos y especiales, haciendo inviable un ataque de diccionario o fuerza bruta en un tiempo razonable.
*   **Mejora de seguridad:** Aunque en este ejemplo está en el código, en un entorno de producción real, esta clave debería cargarse desde una variable de entorno segura.

```php
// Corrección aplicada en jwt_weak.php
// Uso de una clave secreta fuerte
$key = "k9js83nls92kd02nd_STRONG_SECRET_KEY_!@#$"; 

// Generación del token con la nueva clave robusta
$jwt = JWT::encode($payload, $key, "HS256");
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:

1.  He generado un nuevo token ejecutando el script corregido.
2.  He comprobado que el token generado es válido.
3.  He verificado que este nuevo token ya no puede ser validado ni decodificado utilizando la clave antigua ("example_key"), lo que confirma que la firma ha cambiado y ahora depende del secreto robusto.
