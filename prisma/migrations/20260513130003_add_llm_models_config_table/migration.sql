-- CreateTable
CREATE TABLE "LlmModelConfig" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LlmModelConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LlmModelConfig_id_key" ON "LlmModelConfig"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LlmModelConfig_key_key" ON "LlmModelConfig"("key");
