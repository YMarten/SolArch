# Separación de alojamiento y administración

Se agrega managementModel (ManagementModel), con UNKNOWN como valor inicial.
hostingMode queda independiente. No se agrega ningún campo para SaaS.

| Alojamiento anterior | Alojamiento nuevo | Administración |
| --- | --- | --- |
| ON_PREMISE | ON_PREMISE | COMPANY_MANAGED |
| CLOUD_COMPANY | CLOUD_COMPANY | UNKNOWN |
| SAAS | EXTERNAL | PROVIDER_MANAGED |
| PROVIDER_HOSTED | EXTERNAL | PROVIDER_MANAGED |
| HYBRID | HYBRID | UNKNOWN |
| UNKNOWN | UNKNOWN | UNKNOWN |

El alojamiento original de cada solución queda en ChangeLog, identificado por
performedBy=migration:20260910010000_separate_hosting_management.
No se eliminan soluciones ni se cambian IDs, relaciones u otros campos.
El SQL es transaccional y bloquea Solution durante la conversión.

Desplegar API y frontend juntos. Respaldar previamente los datos y evitar
escrituras de versiones anteriores durante el despliegue.
Desde solarch-api:

    npx prisma migrate deploy
    npx prisma generate
    npm run build

Reiniciar la API y compilar/reiniciar el frontend. Los clientes anteriores
que envíen SAAS o PROVIDER_HOSTED como alojamiento recibirán HTTP 400.
Un PUT que omita managementModel conserva su valor actual.

Pruebas:

    node --require ts-node/register src/tests/solution-states.test.ts
    node src/tests/hosting-management-migration.test.cjs

La prueba SQL cubre las seis equivalencias, valores iniciales y conservación
del alojamiento original; usa un esquema aislado y termina con ROLLBACK.

Archivos de implementación:
- prisma/schema.prisma
- src/types/solution.types.ts
- src/routes/solutions.route.ts
- src/tests/solution-states.test.ts
- src/tests/hosting-management-migration.test.cjs
- solarch-web/types/solution.ts
- solarch-web/lib/hosting-mode.ts
- solarch-web/components/solutions/SolutionForm.tsx
- solarch-web/components/solutions/SolutionFilters.tsx
- solarch-web/components/solutions/SolutionSurveyDetails.tsx
- solarch-web/app/solutions/page.tsx
- solarch-web/app/solutions/[id]/edit/page.tsx
