BEGIN;

-- Prevent concurrent writes between the safety check and enum conversion.
LOCK TABLE "Solution" IN ACCESS EXCLUSIVE MODE;
-- CLOUD cannot distinguish a company cloud account from SaaS. Do not guess.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Solution" WHERE "hostingMode"::text = 'CLOUD') THEN
    RAISE EXCEPTION 'Hay soluciones con CLOUD. Revisar su alojamiento antes de aplicar esta migración.';
  END IF;
END $$;

ALTER TYPE "HostingMode" RENAME VALUE 'INTERNAL_INFRASTRUCTURE' TO 'ON_PREMISE';
ALTER TYPE "HostingMode" RENAME VALUE 'VENDOR_INFRASTRUCTURE' TO 'PROVIDER_HOSTED';
ALTER TYPE "HostingMode" RENAME VALUE 'CLOUD' TO 'CLOUD_COMPANY';
ALTER TYPE "HostingMode" ADD VALUE 'SAAS';

COMMIT;
