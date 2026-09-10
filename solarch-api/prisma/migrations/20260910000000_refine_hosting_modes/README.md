# Modalidades de alojamiento

- INTERNAL_INFRASTRUCTURE pasa a ON_PREMISE.
- VENDOR_INFRASTRUCTURE pasa a PROVIDER_HOSTED; no se presupone que sea SaaS.
- HYBRID y UNKNOWN se conservan.
- Se habilitan CLOUD_COMPANY y SAAS.

La migración aborta si hay soluciones con CLOUD: el código antiguo no distingue
nube de la empresa de SaaS. Esos registros requieren evaluación antes del despliegue.
En la revisión previa: 10 internas, 1 del proveedor (XSales SFA), 14 UNKNOWN,
ninguna CLOUD. XSales SFA puede requerir reclasificación a SAAS si se confirma
que el proveedor ofrece la solución como servicio.

Se renombran los valores del enum sin recrear registros ni cambiar IDs,
relaciones, fechas de actualización u otros campos. El cambio es transaccional
y bloquea Solution durante la comprobación y conversión.

Despliegue coordinado: respaldar los registros, detener escrituras de clientes
anteriores, ejecutar desde solarch-api `npx prisma migrate deploy`,
`npx prisma generate`, compilar y reiniciar API y frontend.
Los clientes anteriores deben actualizarse: los códigos retirados devuelven 400.

Pruebas:
- `node --require ts-node/register src/tests/solution-states.test.ts`
- `node src/tests/hosting-migration.test.cjs`

La prueba SQL usa datos sintéticos en un esquema transaccional aislado, comprueba
el rechazo de CLOUD y la conservación de registros y default, y hace ROLLBACK.
