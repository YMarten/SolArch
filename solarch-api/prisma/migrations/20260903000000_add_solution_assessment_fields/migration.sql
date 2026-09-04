CREATE TYPE "UsageStatus" AS ENUM ('IN_USE', 'LIMITED_USE', 'IN_IMPLEMENTATION', 'IN_SUBSTITUTION', 'OUT_OF_USE');
CREATE TYPE "UsageFrequency" AS ENUM ('CONTINUOUS', 'DAILY', 'WEEKLY', 'MONTHLY', 'OCCASIONAL', 'UNKNOWN');
CREATE TYPE "AnswerStatus" AS ENUM ('YES', 'NO', 'UNKNOWN');
CREATE TYPE "HostingMode" AS ENUM ('CLOUD', 'INTERNAL_INFRASTRUCTURE', 'VENDOR_INFRASTRUCTURE', 'HYBRID', 'UNKNOWN');
CREATE TYPE "FailureImpact" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'UNKNOWN');

ALTER TABLE "Solution"
  ADD COLUMN "responsibleAreaId" TEXT,
  ADD COLUMN "businessProcess" TEXT,
  ADD COLUMN "userGroups" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "usageStatus" "UsageStatus",
  ADD COLUMN "usageFrequency" "UsageFrequency",
  ADD COLUMN "hasSimilarSolution" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "similarSolutionId" TEXT,
  ADD COLUMN "supportStatus" "AnswerStatus" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "receivesUpdates" "AnswerStatus" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "licenseStatus" "AnswerStatus" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "hostingMode" "HostingMode" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "knownDependencies" TEXT,
  ADD COLUMN "failureImpact" "FailureImpact" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "failureImpactDetails" TEXT,
  ADD COLUMN "hasProblems" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "problemDetails" TEXT,
  ADD COLUMN "hasReplacementInitiative" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "replacementSolutionId" TEXT,
  ADD COLUMN "proposedReplacementName" TEXT,
  ADD COLUMN "additionalNotes" TEXT;

ALTER TABLE "Solution" ADD CONSTRAINT "Solution_responsibleAreaId_fkey" FOREIGN KEY ("responsibleAreaId") REFERENCES "BusinessArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_similarSolutionId_fkey" FOREIGN KEY ("similarSolutionId") REFERENCES "Solution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_replacementSolutionId_fkey" FOREIGN KEY ("replacementSolutionId") REFERENCES "Solution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Solution_responsibleAreaId_idx" ON "Solution"("responsibleAreaId");
CREATE INDEX "Solution_usageStatus_idx" ON "Solution"("usageStatus");
CREATE INDEX "Solution_hostingMode_idx" ON "Solution"("hostingMode");
CREATE INDEX "Solution_supportStatus_idx" ON "Solution"("supportStatus");
CREATE INDEX "Solution_licenseStatus_idx" ON "Solution"("licenseStatus");
CREATE INDEX "Solution_hasProblems_idx" ON "Solution"("hasProblems");
CREATE INDEX "Solution_hasReplacementInitiative_idx" ON "Solution"("hasReplacementInitiative");
CREATE INDEX "Solution_similarSolutionId_idx" ON "Solution"("similarSolutionId");
CREATE INDEX "Solution_replacementSolutionId_idx" ON "Solution"("replacementSolutionId");
