-- This migration adds the VoiceInput table if it doesn't already exist
-- AlterTable
CREATE TABLE IF NOT EXISTS "VoiceInput" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "audioUrl" TEXT NOT NULL,
  "transcript" TEXT,
  "processed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "VoiceInput_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VoiceInput" ADD CONSTRAINT "VoiceInput_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
