BEGIN;
LOCK TABLE "Solution" IN ACCESS EXCLUSIVE MODE;

INSERT INTO "ChangeLog" ("id", "action", "entityType", "field", "oldValue", "newValue", "note", "performedBy", "solutionId")
SELECT 'merge_channel_' || "id", 'UPDATED', 'Solution', 'role',
  'INTERACTION_CHANNEL', 'SATELLITE',
  'El rol Satélite incorpora los canales de interacción.',
  'migration:20260915000000_merge_channel_into_satellite', "id"
FROM "Solution" WHERE "role"::text = 'INTERACTION_CHANNEL';

CREATE TYPE "SolutionRole_new" AS ENUM ('CORE_TRANSACTIONAL', 'SATELLITE', 'INTEGRATION', 'DATA_ANALYTICS');
ALTER TABLE "Solution" ALTER COLUMN "role" TYPE "SolutionRole_new"
USING (CASE WHEN "role"::text = 'INTERACTION_CHANNEL' THEN 'SATELLITE' ELSE "role"::text END)::"SolutionRole_new";
DROP TYPE "SolutionRole";
ALTER TYPE "SolutionRole_new" RENAME TO "SolutionRole";
COMMIT;
