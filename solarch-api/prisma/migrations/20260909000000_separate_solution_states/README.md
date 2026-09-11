# Separación de estados de soluciones

La migración conserva los registros, sus IDs y su estado arquitectónico.
Agrega RETIRED al estado arquitectónico y guarda el estado de uso original
en legacyUsageStatus (solo lectura en la API).

| Uso anterior | Uso nuevo |
| --- | --- |
| IN_USE | IN_USE |
| LIMITED_USE | LIMITED_USE |
| OUT_OF_USE | NOT_IN_USE |
| IN_IMPLEMENTATION | NULL, pendiente de revisión |
| IN_SUBSTITUTION | NULL, pendiente de revisión |
| NULL | NULL |

Los dos valores ambiguos no permiten inferir el uso real. Su valor original
se conserva y se muestra en el detalle mientras el uso esté pendiente.
No se deduce ni modifica el estado arquitectónico a partir del uso.

## Despliegue

1. Respaldar la base de datos y detener la API anterior y sus escritores.
2. Desde solarch-api, ejecutar: npx prisma migrate deploy
3. Ejecutar: npx prisma generate
4. Compilar y desplegar la API y el frontend juntos; reiniciar la API.

La migración necesita un bloqueo de la tabla Solution durante la conversión.
Los clientes antiguos que envíen códigos de uso retirados recibirán HTTP 400.
No usar prisma migrate reset ni db push para desplegar este cambio.
El SQL es transaccional; si falla, se revierte. Tras aplicarlo, no revertir
simplemente el código a una versión anterior sin planificar la compatibilidad
con NOT_IN_USE y RETIRED y los datos nuevos.

## Verificación

- node --require ts-node/register --test src/tests/solution-states.test.ts
- node --test src/tests/solution-states-migration.test.cjs

La segunda prueba requiere DATABASE_URL y permiso para crear un esquema;
usa datos sintéticos en un esquema aislado y siempre hace ROLLBACK.
No aplica la migración a las tablas de la aplicación.

Actualmente no existe autorización por roles en la aplicación; el campo
Estado arquitectónico, ubicado en Identificación, no introduce control de acceso.
