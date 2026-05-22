-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "codigoProduto" TEXT NOT NULL,
    "descricaoProduto" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "fotoProduto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_codigoProduto_key" ON "Product"("codigoProduto");
