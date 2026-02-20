# Proyecto SIEM: Implementación y Configuración (ELK + IDS Snort)

**Actividad:** 2.b.02 - Implementación y Configuración de SIEM  
**Módulo:** Implantación de Sistemas (IS)  
**Alumno:** Manuel Pérez Romero  

## Descripción del Proyecto
Este proyecto documenta el despliegue de una infraestructura SIEM basada en **ELK Stack (Elasticsearch, Logstash, Kibana)** y su integración con un **IDS (Snort)** para la detección de amenazas en red.

El objetivo principal es configurar un caso de uso específico para detectar **ataques de fuerza bruta (SSH)** y tráfico de reconocimiento anómalo, centralizando las alertas en un dashboard de Kibana.

## Estructura de la Documentación
A continuación se enlazan los documentos requeridos para la evaluación:

### 1. [Instalación y Configuración del Entorno](./docs/Instalación.md)
*   Despliegue de contenedores Docker (ELK, Filebeat+Snort).
*   Configuración de red y memoria del host.
*   Solución de problemas comunes durante la instalación.

### 2. [Definición del Caso de Uso](./docs/Casos_de_uso.md)
*   **Identificación:** Detección de Ataques de Fuerza Bruta SSH e ICMP Flood.
*   **Descripción:** Análisis de la amenaza, actores involucrados y lógica de detección teórica.
*   **Objetivo:** Alertar sobre intentos de acceso no autorizado persistentes.

### 3. [Implementación Técnica y Pruebas](./docs/Implementación.md)
*   Configuración detallada de **Snort (Reglas locales)**.
*   Integración de **Filebeat** para el envío de logs al SIEM.
*   **Pruebas de Concepto (PoC):** Simulación de ataques con Hydra y Ping.
*   **Visualización:** Capturas de pantalla de la detección en Kibana.

---

## Resumen de Tecnologías
*   **SIEM:** ELK Stack (v7.16.3)
*   **IDS:** Snort (v2.9.x)
*   **Agente:** Filebeat
*   **Contenerización:** Docker
*   **Herramientas de Ataque (Simuladas):** Hydra, Nmap/Ping

## Estado del Proyecto
*   [x] Infraestructura Desplegada
*   [x] IDS Configurado
*   [x] Caso de Uso Implementado
*   [x] Documentación Finalizada

> **Nota:** Las capturas de pantalla de la evidencia se encuentran insertadas en los documentos correspondientes en la carpeta `docs/`.
