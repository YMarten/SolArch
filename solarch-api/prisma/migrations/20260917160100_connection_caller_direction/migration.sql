-- Previous convention: provider -> consumer. New convention: caller -> called solution.
-- Deploy together with the new connection form; existing IDs and descriptions are preserved.
BEGIN;
LOCK TABLE "Connection" IN ACCESS EXCLUSIVE MODE;
DROP INDEX "Connection_fromId_toId_type_key";
UPDATE "Connection" SET "fromId" = "toId", "toId" = "fromId";
-- The documented Interfaz/Punto Venta connection uses SOAP, previously unavailable in the enum.
UPDATE "Connection" c SET "type" = 'SOAP'
FROM "Solution" caller, "Solution" target
WHERE c."fromId" = caller."id" AND c."toId" = target."id"
AND caller."name" = 'Aplicaciones de Interfaz' AND target."name" = 'WS_PUNTO_VENTA'
AND c."type" = 'OTHER' AND c."description" ILIKE '%SOAP%'
AND NOT EXISTS (SELECT 1 FROM "Connection" other WHERE other."fromId" = c."fromId" AND other."toId" = c."toId" AND other."type" = 'SOAP');
CREATE UNIQUE INDEX "Connection_fromId_toId_type_key" ON "Connection"("fromId", "toId", "type");
COMMIT;
