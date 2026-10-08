ALTER TABLE "Connection" ADD COLUMN "intermediarySolutionId" TEXT;
CREATE INDEX "Connection_intermediarySolutionId_idx" ON "Connection"("intermediarySolutionId");
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_intermediarySolutionId_fkey" FOREIGN KEY ("intermediarySolutionId") REFERENCES "Solution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_intermediary_distinct" CHECK ("intermediarySolutionId" IS NULL OR ("intermediarySolutionId" <> "fromId" AND "intermediarySolutionId" <> "toId"));
