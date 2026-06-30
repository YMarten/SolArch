-- CreateEnum
CREATE TYPE "SolutionStatus" AS ENUM ('ACTIVE', 'DEPRECATED', 'IN_SUBSTITUTION', 'IN_DEVELOPMENT', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SolutionType" AS ENUM ('WEB', 'DESKTOP', 'MOBILE', 'API', 'BATCH', 'INTEGRATION', 'INFRASTRUCTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "Criticality" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "SolutionRole" AS ENUM ('CORE_TRANSACTIONAL', 'SATELLITE', 'INTEGRATION', 'DATA_ANALYTICS', 'INTERACTION_CHANNEL');

-- CreateEnum
CREATE TYPE "SolutionOrigin" AS ENUM ('INTERNAL', 'EXTERNAL', 'CUSTOM_THIRD');

-- CreateEnum
CREATE TYPE "ConnectionType" AS ENUM ('REST', 'GRAPHQL', 'EVENT', 'SHARED_DB', 'FILE', 'WEBHOOK', 'GRPC', 'OTHER');

-- CreateEnum
CREATE TYPE "AttachmentCategory" AS ENUM ('DIAGRAM', 'FUNCTIONAL_DOC', 'TECHNICAL_DOC', 'RUNBOOK', 'ADR', 'API_CONTRACT', 'OTHER');

-- CreateEnum
CREATE TYPE "TechCategory" AS ENUM ('LANGUAGE', 'FRAMEWORK', 'DATABASE', 'INFRASTRUCTURE', 'MESSAGING', 'SECURITY', 'MONITORING', 'OTHER');

-- CreateEnum
CREATE TYPE "ChangeAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'RELATION_ADDED', 'RELATION_REMOVED');

-- CreateEnum
CREATE TYPE "ReviewResult" AS ENUM ('COMPLIANT', 'COMPLIANT_WITH_NOTES', 'NON_COMPLIANT', 'IN_REVIEW');

-- CreateEnum
CREATE TYPE "ReviewDimensionType" AS ENUM ('SECURITY', 'SCALABILITY', 'MAINTAINABILITY', 'DOCUMENTATION', 'TECH_ALIGNMENT', 'INTEGRATION_PATTERNS', 'DATA_MANAGEMENT', 'RESILIENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT,
    "status" "SolutionStatus" NOT NULL,
    "type" "SolutionType" NOT NULL,
    "role" "SolutionRole" NOT NULL,
    "criticality" "Criticality" NOT NULL,
    "origin" "SolutionOrigin" NOT NULL,
    "vendor" TEXT,
    "owner" TEXT NOT NULL,
    "techOwner" TEXT,
    "repoUrl" TEXT,
    "lastDeploy" TIMESTAMP(3),
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TechCategory" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnologyOnSolution" (
    "solutionId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "version" TEXT,

    CONSTRAINT "TechnologyOnSolution_pkey" PRIMARY KEY ("solutionId","technologyId")
);

-- CreateTable
CREATE TABLE "BusinessDomain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainOnSolution" (
    "solutionId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "DomainOnSolution_pkey" PRIMARY KEY ("solutionId","domainId")
);

-- CreateTable
CREATE TABLE "BusinessCapability" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "domainId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapabilityOnSolution" (
    "solutionId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,

    CONSTRAINT "CapabilityOnSolution_pkey" PRIMARY KEY ("solutionId","capabilityId")
);

-- CreateTable
CREATE TABLE "BusinessArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaOnSolution" (
    "solutionId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "AreaOnSolution_pkey" PRIMARY KEY ("solutionId","areaId")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "type" "ConnectionType" NOT NULL,
    "description" TEXT,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" "AttachmentCategory" NOT NULL,
    "description" TEXT,
    "solutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "solutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchReview" (
    "id" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "reviewedBy" TEXT NOT NULL,
    "result" "ReviewResult" NOT NULL,
    "summary" TEXT,
    "reviewedVersion" TEXT,
    "nextReviewDate" TIMESTAMP(3),
    "solutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArchReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewDimension" (
    "id" TEXT NOT NULL,
    "dimension" "ReviewDimensionType" NOT NULL,
    "result" "ReviewResult" NOT NULL,
    "observation" TEXT,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "ReviewDimension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewAction" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "reviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeLog" (
    "id" TEXT NOT NULL,
    "action" "ChangeAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "field" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "note" TEXT,
    "performedBy" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Solution_status_idx" ON "Solution"("status");

-- CreateIndex
CREATE INDEX "Solution_type_idx" ON "Solution"("type");

-- CreateIndex
CREATE INDEX "Solution_role_idx" ON "Solution"("role");

-- CreateIndex
CREATE INDEX "Solution_criticality_idx" ON "Solution"("criticality");

-- CreateIndex
CREATE INDEX "Solution_origin_idx" ON "Solution"("origin");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDomain_name_key" ON "BusinessDomain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessCapability_name_domainId_key" ON "BusinessCapability"("name", "domainId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessArea_name_key" ON "BusinessArea"("name");

-- CreateIndex
CREATE INDEX "Connection_fromId_idx" ON "Connection"("fromId");

-- CreateIndex
CREATE INDEX "Connection_toId_idx" ON "Connection"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_fromId_toId_type_key" ON "Connection"("fromId", "toId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Environment_solutionId_name_key" ON "Environment"("solutionId", "name");

-- CreateIndex
CREATE INDEX "ArchReview_solutionId_idx" ON "ArchReview"("solutionId");

-- CreateIndex
CREATE INDEX "ArchReview_reviewedAt_idx" ON "ArchReview"("reviewedAt");

-- CreateIndex
CREATE INDEX "ArchReview_result_idx" ON "ArchReview"("result");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewDimension_reviewId_dimension_key" ON "ReviewDimension"("reviewId", "dimension");

-- CreateIndex
CREATE INDEX "ReviewAction_reviewId_idx" ON "ReviewAction"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewAction_status_idx" ON "ReviewAction"("status");

-- CreateIndex
CREATE INDEX "ReviewAction_dueDate_idx" ON "ReviewAction"("dueDate");

-- CreateIndex
CREATE INDEX "ChangeLog_solutionId_idx" ON "ChangeLog"("solutionId");

-- CreateIndex
CREATE INDEX "ChangeLog_createdAt_idx" ON "ChangeLog"("createdAt");

-- AddForeignKey
ALTER TABLE "TechnologyOnSolution" ADD CONSTRAINT "TechnologyOnSolution_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnologyOnSolution" ADD CONSTRAINT "TechnologyOnSolution_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessDomain" ADD CONSTRAINT "BusinessDomain_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BusinessDomain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainOnSolution" ADD CONSTRAINT "DomainOnSolution_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainOnSolution" ADD CONSTRAINT "DomainOnSolution_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "BusinessDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessCapability" ADD CONSTRAINT "BusinessCapability_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BusinessCapability"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessCapability" ADD CONSTRAINT "BusinessCapability_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "BusinessDomain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapabilityOnSolution" ADD CONSTRAINT "CapabilityOnSolution_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapabilityOnSolution" ADD CONSTRAINT "CapabilityOnSolution_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "BusinessCapability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaOnSolution" ADD CONSTRAINT "AreaOnSolution_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaOnSolution" ADD CONSTRAINT "AreaOnSolution_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "BusinessArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Environment" ADD CONSTRAINT "Environment_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchReview" ADD CONSTRAINT "ArchReview_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewDimension" ADD CONSTRAINT "ReviewDimension_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "ArchReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAction" ADD CONSTRAINT "ReviewAction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "ArchReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
