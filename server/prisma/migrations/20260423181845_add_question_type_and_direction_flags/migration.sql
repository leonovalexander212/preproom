-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TECHNICAL', 'BEHAVIORAL', 'LOGIC_PUZZLE');

-- AlterTable
ALTER TABLE "Direction" ADD COLUMN     "category" TEXT,
ADD COLUMN     "hasDifficultyLevels" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'TECHNICAL',
ALTER COLUMN "difficulty" DROP NOT NULL,
ALTER COLUMN "difficulty" DROP DEFAULT;
