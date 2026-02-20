# Documentación del Caso de Uso: Detección de Ataques de Fuerza Bruta y Análisis de Red

## 1. Identificación del Caso de Uso
* **ID:** 2.b.02-BF
* **Nombre:** Detección de Intentos de Acceso no Autorizado (Fuerza Bruta) y Tráfico Anómalo.
* **Descripción:** Implementar un mecanismo para detectar ataques de fuerza bruta contra el servicio SSH y monitorear el tráfico ICMP (Ping) en la red interna para identificar escaneos de disponibilidad.
* **Nivel de Severidad:** Alto.
* **Actores:** Atacante (Externo/Interno), Analista de Seguridad (SOC).

## 2. Objetivo
El objetivo principal es identificar y alertar sobre intentos repetidos y fallidos de acceso al sistema a través de SSH, lo cual es indicativo de un ataque de diccionario o fuerza bruta (tool: Hydra). Secundariamente, detectar tráfico ICMP que podría preceder a un ataque (reconocimiento).

## 3. Precondiciones
*   El sistema SIEM (ELK) debe estar operativo y recibiendo logs.
*   El IDS (Snort) debe estar instalado en el endpoint y configurado para inspeccionar el tráfico.
*   El endpoint debe tener el puerto 22 (SSH) y el protocolo ICMP habilitados y accesibles.

## 4. Escenario de Ataque (Simulación)
Para validar el caso de uso, se simulará el tráfico malicioso mediante la ejecución repetida de comandos de conexión desde el contenedor ELK hacia el contenedor objetivo (`172.19.0.2`). Esto generará los logs necesarios para activar las reglas de Snort.

**Script de Generación de Tráfico (Windows CMD):**
Este bucle realiza 5 iteraciones enviando un `ping` (ICMP) y un intento de conexión al puerto 22 (TCP/SSH).

```cmd
for /l %i in (1,1,5) do (
   docker exec -it elk ping -c 1 172.19.0.2
   docker exec -it elk bash -c "timeout 1 bash -c '</dev/tcp/172.19.0.2/22'"
)
```

1.  **Tráfico ICMP:** El comando `ping` genera paquetes que son detectados por la regla de reconocimiento.
2.  **Tráfico SSH:** La conexión TCP al puerto 22 (`/dev/tcp/...`) simula un intento de acceso que activa la alerta SSH.

> ![alt text](img/image-6.png)

## 5. Lógica de Detección (Reglas)

### 5.1. Detección de Reconocimiento (ICMP)
Se configurará una regla en Snort para alertar sobre cualquier paquete ICMP dirigido a la red local.

*   **Regla Snort:**
    ```snort
    alert icmp any any -> $HOME_NET any (msg:"Trafico ICMP Detectado - Posible Reconocimiento"; sid:3000001; rev:1;)
    ```

### 5.2. Detección de Fuerza Bruta SSH
Se configurará una regla para detectar intentos de conexión SSH. Para reducir el ruido y detectar fuerza bruta, se puede utilizar un umbral (threshold).

*   **Regla Snort (Avanzada):**
    ```snort
    alert tcp any any -> $HOME_NET 22 (msg:"Posible Ataque de Fuerza Bruta SSH"; flow:established,to_server; content:"SSH-"; fast_pattern; threshold:type threshold, track by_src, count 5, seconds 60; sid:3000002; rev:1;)
    ```
    *Nota: En la práctica inicial, una regla simple de detección SSH puede ser suficiente para verificar la conectividad.*

## 6. Respuesta Esperada
1.  **Snort:** Genera entradas en el archivo `/var/log/snort/alert` o `/var/log/snort/snort.alert.fast`.
2.  **Filebeat:** Lee el archivo de alertas y envía el evento a Logstash.
3.  **Logstash:** Procesa y enriquece el evento.
4.  **Elasticsearch:** Indexa el documento.
5.  **Kibana:** Muestra la alerta en el Dashboard en tiempo real, permitiendo al analista correlacionar el evento con la IP de origen del atacante.

> ![alt text](img/image-7.png)

## 7. Post-Condiciones
*   La alerta es visible en el Dashboard "Resumen de Seguridad".
*   El equipo de respuesta a incidentes es notificado (simulado).
