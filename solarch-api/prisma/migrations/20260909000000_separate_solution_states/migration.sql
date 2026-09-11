BEGIN;

ALTER TYPE "SolutionStatus" ADD VALUE 'RETIRED';

-- Preserve the original value before converting the usage classification.
ALTER TABLE "Solution" ADD COLUMN "legacyUsageStatus" TEXT;
UPDATE "Solution"
SET "legacyUsageStatus" = "usageStatus"::text
WHERE "usageStatus" IS NOT NULL;

CREATE TYPE "UsageStatus_new" AS ENUM ('IN_USE', 'LIMITED_USE', 'NOT_IN_USE');
ALTER TABLE "Solution" ALTER COLUMN "usageStatus" TYPE "UsageStatus_new"
USING (
  CASE "usageStatus"::text
    WHEN 'OUT_OF_USE' THEN 'NOT_IN_USE'
    WHEN 'IN_IMPLEMENTATION' THEN NULL
    WHEN 'IN_SUBSTITUTION' THEN NULL
    ELSE "usageStatus"::text
  END
)::"UsageStatus_new";
DROP TYPE "UsageStatus";
ALTER TYPE "UsageStatus_new" RENAME TO "UsageStatus";

COMMIT;
