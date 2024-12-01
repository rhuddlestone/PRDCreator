-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRD" (
    "id" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "appDescription" TEXT NOT NULL,
    "progLanguage" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "styling" TEXT NOT NULL,
    "backend" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "payments" TEXT NOT NULL,
    "otherPackages" TEXT NOT NULL,
    "llmProcessed" BOOLEAN NOT NULL DEFAULT false,
    "llmResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PRD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "pageDescription" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "llmProcessed" BOOLEAN NOT NULL DEFAULT false,
    "llmResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastProcessed" TIMESTAMP(3),
    "prdId" TEXT NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Implementation" (
    "id" TEXT NOT NULL,
    "setupSteps" JSONB NOT NULL,
    "fileStructure" JSONB NOT NULL,
    "dependencies" JSONB NOT NULL,
    "deploymentGuide" JSONB NOT NULL,
    "llmProcessed" BOOLEAN NOT NULL DEFAULT false,
    "llmResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastProcessed" TIMESTAMP(3),
    "prdId" TEXT NOT NULL,

    CONSTRAINT "Implementation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "PRD_userId_idx" ON "PRD"("userId");

-- CreateIndex
CREATE INDEX "Page_prdId_idx" ON "Page"("prdId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_prdId_orderIndex_key" ON "Page"("prdId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Implementation_prdId_key" ON "Implementation"("prdId");

-- CreateIndex
CREATE INDEX "Implementation_prdId_idx" ON "Implementation"("prdId");

-- AddForeignKey
ALTER TABLE "PRD" ADD CONSTRAINT "PRD_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_prdId_fkey" FOREIGN KEY ("prdId") REFERENCES "PRD"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Implementation" ADD CONSTRAINT "Implementation_prdId_fkey" FOREIGN KEY ("prdId") REFERENCES "PRD"("id") ON DELETE CASCADE ON UPDATE CASCADE;
