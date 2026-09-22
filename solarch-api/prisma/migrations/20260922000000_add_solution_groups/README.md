# Grupos de soluciones

Migración aditiva: crea `SolutionGroup`, `SolutionGroupMember` y el enum
`SolutionParticipation` (`NEW`, `REUSED`, `ADAPTED`). No modifica soluciones existentes.
La clave compuesta evita duplicar una solución en el mismo grupo. Eliminar un grupo
elimina sus asociaciones y conserva las soluciones.

Desde `solarch-api`, con acceso a la base configurada:

```powershell
npx.cmd prisma migrate status
npx.cmd prisma migrate deploy
npx.cmd prisma generate
npm.cmd run build
npm.cmd run test:groups
```

Reiniciar la API para cargar el cliente generado y las rutas `/api/groups`.
La interfaz está disponible en `/groups` y en la pestaña Grupos de cada solución.

Pruebas de validación HTTP sin conexión a la base:

```powershell
npx.cmd ts-node src/tests/groups.routes.test.ts
```
