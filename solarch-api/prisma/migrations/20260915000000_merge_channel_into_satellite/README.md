# Canal se integra en Satélite

SATELLITE incluye funciones específicas de negocio y canales de acceso e
interacción para usuarios. Se retira INTERACTION_CHANNEL de SolutionRole.

La migración convierte las soluciones Canal a Satélite, conserva sus IDs y
demás campos y registra el cambio en ChangeLog. No altera migraciones anteriores.
Se ejecuta en una transacción con bloqueo de Solution.

Desplegar API y frontend juntos y reiniciar la API para recargar el cliente Prisma:

    npx prisma migrate deploy
    npx prisma generate
    npm run build

Los clientes antiguos que envíen INTERACTION_CHANNEL recibirán HTTP 400.
Las pruebas cubren los cuatro roles válidos, rechazo de Canal en POST/PUT
y conservación de registros en un esquema SQL aislado con ROLLBACK.
