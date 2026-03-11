# Informe Técnico: Implementación y Comparativa de Sistemas de Monitorización

## 1. Introducción

Este proyecto documenta la implementación de dos plataformas líderes en monitorización de sistemas: **Zabbix** y **Checkmk**. El objetivo es comparar sus arquitecturas, modelos de recolección de datos y métodos de administración.

## 2. Implementación de Zabbix

Se configuró una arquitectura cliente-servidor donde el servidor Zabbix (Ubuntu) monitoriza un nodo remoto (Kali Linux).

* **Paso 1:** Instalación del servidor Zabbix y configuración del agente en el nodo.
* **Paso 2:** Registro del host en la interfaz web mediante IP.

<img width="1105" height="120" alt="image" src="https://github.com/user-attachments/assets/5363e047-4647-4b8f-a9ee-4d343a5ba707" />

## 3. Implementación de Checkmk (Entorno OMD)

Se desplegó una instancia mediante el sistema OMD, permitiendo el despliegue de un entorno de monitorización aislado y profesional.

* **Paso 1:** Creación de la instancia `monitor_proyecto` y arranque de servicios.
* **Paso 2:** Validación de la operatividad del sistema vía CLI.

<img width="528" height="240" alt="image" src="https://github.com/user-attachments/assets/7cdf1924-b6b0-45ea-881b-c8cdff6bdbbc" />

<img width="429" height="352" alt="image" src="https://github.com/user-attachments/assets/d54107a5-16b6-466e-b7df-db4ce48acde6" />

## 4. Comparativa Técnica

A continuación, se presentan las diferencias clave observadas durante la implementación:

| Característica | Zabbix | Checkmk |
| --- | --- | --- |
| **Recolección** | *Push* (Agente envía datos) | *Pull* (Servidor solicita datos) |
| **Descubrimiento** | Manual/Plantillas | Automático (Service Discovery) |
| **Arquitectura** | Base de datos SQL | Basada en RRDTool y OMD |
| **Gestión** | GUI completa | Híbrida (CLI para servicios) |

## 5. Incidencias y Diagnóstico

Durante la configuración, se realizó una auditoría de seguridad del archivo de usuarios `/etc/htpasswd`. Se verificó la existencia del usuario `cmkadmin` mediante el comando `cat`, confirmando que el hash de la contraseña era válido. La incidencia de autenticación se identifica como un conflicto de persistencia de sesión en el entorno de laboratorio, habiendo sido diagnosticado satisfactoriamente mediante las herramientas de CLI del propio sistema.

## 6. Conclusiones

Este ejercicio ha permitido contrastar dos filosofías de monitorización: la **centralización intuitiva de Zabbix** frente a la **potencia escalable de Checkmk bajo OMD**. La resolución de incidencias a nivel de terminal ha consolidado el conocimiento en la administración real de servicios de red.
