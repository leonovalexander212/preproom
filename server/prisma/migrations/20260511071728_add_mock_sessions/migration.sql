-- CreateTable
CREATE TABLE "MockSession" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'qa',
    "sourceInterviewTitle" TEXT,
    "durationMs" INTEGER NOT NULL DEFAULT 2100000,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentQuestionIdx" INTEGER NOT NULL DEFAULT 0,
    "currentCodingIdx" INTEGER NOT NULL DEFAULT 0,
    "questions" JSONB NOT NULL,
    "codingTasks" JSONB NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '[]',
    "coding" JSONB NOT NULL DEFAULT '[]',
    "finalReport" JSONB,

    CONSTRAINT "MockSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockRateLimit" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "attempts" JSONB NOT NULL DEFAULT '[]',
    "penaltyCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "lastCompletedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockRateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MockSession_ip_idx" ON "MockSession"("ip");

-- CreateIndex
CREATE INDEX "MockSession_createdAt_idx" ON "MockSession"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MockRateLimit_ip_key" ON "MockRateLimit"("ip");

-- CreateIndex
CREATE INDEX "MockRateLimit_ip_idx" ON "MockRateLimit"("ip");
