-- CreateEnum
CREATE TYPE "TipoTercero" AS ENUM ('CLIENTE', 'PROVEEDOR');

-- CreateEnum
CREATE TYPE "TipoCuentaContable" AS ENUM ('ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO');

-- CreateEnum
CREATE TYPE "EstadoAsiento" AS ENUM ('BORRADOR', 'CUADRADO', 'ANULADO');

-- CreateTable
CREATE TABLE "Tercero" (
    "id" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "tipo" "TipoTercero" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tercero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanContable" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" "TipoCuentaContable" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsientoContable" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "glosa" TEXT NOT NULL,
    "estado" "EstadoAsiento" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsientoContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleAsiento" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "debe" DECIMAL(12,2) NOT NULL,
    "haber" DECIMAL(12,2) NOT NULL,
    "asientoId" INTEGER NOT NULL,
    "planContableId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetalleAsiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tercero_ruc_key" ON "Tercero"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "PlanContable_codigo_key" ON "PlanContable"("codigo");

-- CreateIndex
CREATE INDEX "DetalleAsiento_asientoId_planContableId_idx" ON "DetalleAsiento"("asientoId", "planContableId");

-- AddForeignKey
ALTER TABLE "DetalleAsiento" ADD CONSTRAINT "DetalleAsiento_asientoId_fkey" FOREIGN KEY ("asientoId") REFERENCES "AsientoContable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleAsiento" ADD CONSTRAINT "DetalleAsiento_planContableId_fkey" FOREIGN KEY ("planContableId") REFERENCES "PlanContable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
