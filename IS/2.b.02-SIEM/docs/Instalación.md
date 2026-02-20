# Memoria de Instalación y Configuración del SIEM

## 1. Preparación del Entorno (Windows Host)
Para evitar cierres inesperados del contenedor de Elasticsearch se aumentó la memoria virtual:

```bash
wsl -d docker-desktop -u root
sysctl -w vm.max_map_count=262145
```

2. Despliegue del SOC (ELK)

Imagen utilizada

```
sebp/elk:7.16.3
```

Crear red

```
docker network create -d bridge --subnet 172.20.0.0/24 elk-red
```

Ejecutar contenedor

```
docker run -p 5601:5601 -p 9200:9200 -p 5044:5044 -it --name elk --net elk-red --ip 172.20.0.10 -d sebp/elk:7.16.3
```

[CAPTURA: contenedor ELK funcionando]

3. Configuración del Agente (Filebeat)

Problema
Filebeat 8.x fallaba por certificados TLS.

Solución
Se instaló Filebeat 7.16.3 y se deshabilitó SSL:

```
output.logstash:
  hosts: ["172.20.0.10:5044"]
  ssl.enabled: false
```
4. Instalación de Snort

Se compiló Snort 2.9.20 manualmente.

Dependencias

build-essential

libpcap-dev

libtirpc-dev

Problemas solucionados

PCRE → compilado manualmente

RPC → solucionado instalando libtirpc-dev

[CAPTURA: snort -V]
