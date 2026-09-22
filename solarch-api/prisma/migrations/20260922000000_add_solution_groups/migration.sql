CREATE TYPE "SolutionParticipation" AS ENUM ('NEW', 'REUSED', 'ADAPTED');

CREATE TABLE "SolutionGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SolutionGroup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SolutionGroupMember" (
    "groupId" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "participation" "SolutionParticipation" NOT NULL,
    CONSTRAINT "SolutionGroupMember_pkey" PRIMARY KEY ("groupId", "solutionId")
);
CREATE UNIQUE INDEX "SolutionGroup_name_key" ON "SolutionGroup"("name");
CREATE INDEX "SolutionGroupMember_solutionId_idx" ON "SolutionGroupMember"("solutionId");
ALTER TABLE "SolutionGroupMember" ADD CONSTRAINT "SolutionGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SolutionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SolutionGroupMember" ADD CONSTRAINT "SolutionGroupMember_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
