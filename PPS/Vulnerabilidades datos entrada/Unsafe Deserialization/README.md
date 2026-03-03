# Unsafe Deserialization

La deserialización insegura ocurre cuando una aplicación carga objetos serializados sin validación, lo que permite que
un atacante modifique los datos y ejecute código arbitrario.

Impacto de la Deserialización Insegura:
- Escalada de privilegios (ejemplo: convertir un usuario normal en administrador).
- Ejecución de código remoto (RCE) si la aplicación permite __wakeup() o __destruct().
- Modificación de datos internos en la aplicación.