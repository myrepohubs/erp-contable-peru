-- CreateTable
CREATE TABLE "FacturaVenta" (
    "id" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "clienteId" TEXT NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "igv" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "asientoContableId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacturaVenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleFacturaVenta" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "facturaVentaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetalleFacturaVenta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacturaVenta_asientoContableId_key" ON "FacturaVenta"("asientoContableId");

-- CreateIndex
CREATE UNIQUE INDEX "FacturaVenta_serie_numero_key" ON "FacturaVenta"("serie", "numero");

-- AddForeignKey
ALTER TABLE "FacturaVenta" ADD CONSTRAINT "FacturaVenta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Tercero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaVenta" ADD CONSTRAINT "FacturaVenta_asientoContableId_fkey" FOREIGN KEY ("asientoContableId") REFERENCES "AsientoContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFacturaVenta" ADD CONSTRAINT "DetalleFacturaVenta_facturaVentaId_fkey" FOREIGN KEY ("facturaVentaId") REFERENCES "FacturaVenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
