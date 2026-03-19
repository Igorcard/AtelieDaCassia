CREATE TABLE "gateways" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gateways_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "gateways_code_key" ON "gateways"("code");

CREATE TABLE "gateway_endpoints" (
    "id" SERIAL NOT NULL,
    "gatewayId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "httpMethod" TEXT NOT NULL DEFAULT 'POST',
    "path" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gateway_endpoints_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "gateway_endpoints_gatewayId_code_key" ON "gateway_endpoints"("gatewayId", "code");

ALTER TABLE "gateway_endpoints" ADD CONSTRAINT "gateway_endpoints_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "gateways"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "products" ADD COLUMN "shippingWeightKg" DECIMAL(10,3),
ADD COLUMN "shippingLengthCm" INTEGER,
ADD COLUMN "shippingWidthCm" INTEGER,
ADD COLUMN "shippingHeightCm" INTEGER;

INSERT INTO "gateways" ("code", "purpose", "baseUrl", "active", "updatedAt")
VALUES (
  'MELHOR_ENVIO',
  'Integração Melhor Envio: cálculo de frete na cotação e na finalização do pedido.',
  'https://sandbox.melhorenvio.com.br',
  true,
  CURRENT_TIMESTAMP
);

INSERT INTO "gateway_endpoints" ("gatewayId", "code", "httpMethod", "path", "description", "updatedAt")
SELECT g."id", 'SHIPMENT_CALCULATE', 'POST', '/api/v2/me/shipment/calculate',
  'Cotação de fretes por produtos. Documentação: https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos',
  CURRENT_TIMESTAMP
FROM "gateways" g WHERE g."code" = 'MELHOR_ENVIO';
