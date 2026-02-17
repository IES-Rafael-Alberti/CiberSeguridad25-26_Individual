
# Práctica — Seguridad de las contraseñas

---

## 1. Ataque de fuerza bruta

### a.1 Contraseña de 3 caracteres

Se ejecutó el script proporcionado para obtener la contraseña a partir del hash dado utilizando fuerza bruta sobre un alfabeto de 70 caracteres.

**Comando ejecutado**

```

time ./script2 HO HOIW.bruCnPcY

```

**Resultado**

- Contraseña encontrada: **boy**
- Tiempo real: 22.12 s
- Tiempo CPU (user): **12.28 s**

El tiempo relevante es el valor *user*, ya que representa el tiempo real de procesamiento.

---

### Velocidad de cálculo

Número de combinaciones posibles:

```

70³ = 343000

```

Velocidad estimada del sistema:

```

343000 / 12.28 ≈ 27931 intentos/segundo

```

---

### a.2 Contraseña de 4 caracteres

Para adaptar el script a contraseñas de cuatro caracteres se añadió un cuarto bucle `for`, manteniendo la lógica original de generación de combinaciones.

El script fue ejecutado con:

```

time ./script2 LA LA2dsdwOhjmNc

```

Resultado obtenido:

- Tiempo real: 5117.98 s
- Tiempo CPU: 3221.66 s
- Contraseña: no encontrada (ejecución detenida manualmente)

Esto demuestra que el tiempo necesario aumenta significativamente al incrementar la longitud de la contraseña.

---

## 2. Número de combinaciones posibles

La fórmula utilizada para calcular el número de combinaciones es:

```

N = 70^n

````

donde **n** es la longitud de la contraseña.

| Longitud | Combinaciones |
|--------|---------------|
3 | 343000 |
4 | 24010000 |
6 | 117649000000 |
8 | 576480100000000 |

---

### Estimación de tiempos usando velocidad real

Velocidad medida: **27931 intentos/s**

| Longitud | Tiempo estimado |
|--------|----------------|
3 | 12 s |
4 | 14 min |
6 | 49 días |
8 | 653 años |

---

### Análisis

El crecimiento del número de combinaciones es exponencial. Cada carácter añadido multiplica el tiempo necesario por 70, lo que provoca que longitudes relativamente pequeñas vuelvan impracticable el ataque.

---

## 3. Uso de GPU en ataques de fuerza bruta

Las GPU permiten reducir drásticamente los tiempos de búsqueda en ataques de fuerza bruta gracias a su arquitectura paralela. Mientras que una CPU dispone de pocos núcleos optimizados para tareas secuenciales, una GPU posee miles de núcleos capaces de ejecutar cálculos simultáneamente.

En este tipo de ataques, cada intento de contraseña es independiente, lo que permite distribuir el trabajo entre múltiples núcleos. Una CPU solo puede probar unas pocas combinaciones a la vez, mientras que una GPU puede probar miles o millones simultáneamente.

Durante las pruebas realizadas, el sistema alcanzó aproximadamente 28 000 intentos por segundo usando CPU. Herramientas especializadas que utilizan GPU pueden alcanzar velocidades millones de veces superiores, reduciendo ataques que tardarían años en CPU a cuestión de minutos u horas.

Esto demuestra que la seguridad real de una contraseña depende en gran medida de su longitud y complejidad, ya que los atacantes pueden utilizar hardware especializado para acelerar los intentos.

---

## 4. Ataque de fuerza bruta para contraseñas de 8 caracteres

Para adaptar el script a contraseñas de ocho caracteres se añadieron cinco bucles adicionales `for`, ampliando el espacio de búsqueda de manera exponencial.

---

### Script modificado

```bash
#!/bin/bash

space1="a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 1 2 3 4 5 6 7 8 9 0 $ % & / = + @ #"

if [ $# -le 1 ]; then
 echo "use: $0 salt hash"
 exit 1
fi

for a in $space1
do
for b in $space1
do
for c in $space1
do
for d in $space1
do
for e in $space1
do
for f in $space1
do
for g in $space1
do
for h in $space1
do

variable=$(perl -e 'print crypt($ARGV[0], $ARGV[1])' "$a$b$c$d$e$f$g$h" "$1")

if [ "$variable" = "$2" ]; then
 echo "password found: $a$b$c$d$e$f$g$h"
 exit 0
fi

done
done
done
done
done
done
done
done
````

---

### Cálculo de combinaciones

```
70⁸ = 576480100000000
```

Tiempo estimado usando velocidad medida:

```
≈ 653 años
```

---

### Conclusión

El ataque de fuerza bruta se vuelve inviable cuando aumenta la longitud de la contraseña debido al crecimiento exponencial del espacio de búsqueda. Aunque el algoritmo es correcto, el tiempo necesario para completar el ataque excede cualquier límite práctico.

Este resultado demuestra que aumentar la longitud de una contraseña es una de las medidas más eficaces para mejorar la seguridad frente a ataques automatizados.

---

## Conclusión general de la práctica

La práctica demuestra experimentalmente cómo funciona un ataque de fuerza bruta y cómo influyen distintos factores en su eficacia:

* longitud de la contraseña
* tamaño del alfabeto
* eficiencia del algoritmo
* potencia del hardware

Se ha comprobado que pequeñas variaciones en la longitud provocan incrementos enormes en el tiempo necesario, lo que evidencia la importancia de utilizar contraseñas largas y complejas para proteger sistemas frente a ataques de cracking.
