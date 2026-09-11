BEGIN;
LOCK TABLE "Solution" IN ACCESS EXCLUSIVE MODE;

CREATE TYPE "ManagementModel" AS ENUM ('COMPANY_MANAGED', 'PROVIDER_MANAGED', 'SHARED_MANAGEMENT', 'UNKNOWN');
ALTER TABLE "Solution" ADD COLUMN "managementModel" "ManagementModel" NOT NULL DEFAULT 'UNKNOWN';
UPDATE "Solution" SET "managementModel" = CASE
  WHEN "hostingMode"::text = 'ON_PREMISE' THEN 'COMPANY_MANAGED'
  WHEN "hostingMode"::text IN ('SAAS', 'PROVIDER_HOSTED') THEN 'PROVIDER_MANAGED'
  ELSE 'UNKNOWN'
END::"ManagementModel";

INSERT INTO "ChangeLog" ("id", "action", "entityType", "field", "oldValue", "newValue", "note", "performedBy", "solutionId")
SELECT 'hosting_management_' || "id", 'UPDATED', 'Solution', 'hostingMode', "hostingMode"::text,
  CASE WHEN "hostingMode"::text IN ('SAAS', 'PROVIDER_HOSTED') THEN 'EXTERNAL' ELSE "hostingMode"::text END,
  'Separación de alojamiento y administración. managementModel=' || "managementModel"::text,
  'migration:20260910010000_separate_hosting_management', "id"
FROM "Solution";

CREATE TYPE "HostingMode_new" AS ENUM ('ON_PREMISE', 'CLOUD_COMPANY', 'EXTERNAL', 'HYBRID', 'UNKNOWN');
ALTER TABLE "Solution" ALTER COLUMN "hostingMode" DROP DEFAULT;
ALTER TABLE "Solution" ALTER COLUMN "hostingMode" TYPE "HostingMode_new"
USING (CASE WHEN "hostingMode"::text IN ('SAAS', 'PROVIDER_HOSTED') THEN 'EXTERNAL' ELSE "hostingMode"::text END)::"HostingMode_new";
DROP TYPE "HostingMode";
ALTER TYPE "HostingMode_new" RENAME TO "HostingMode";
ALTER TABLE "Solution" ALTER COLUMN "hostingMode" SET DEFAULT 'UNKNOWN';
CREATE INDEX "Solution_managementModel_idx" ON "Solution"("managementModel");
COMMIT;
