-- Backfill-safe: existing rows get placeholders; new orders must send full payload from API.
ALTER TABLE "orders" ADD COLUMN "shippingAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN "deliveryPostalCode" TEXT NOT NULL DEFAULT '';
ALTER TABLE "orders" ADD COLUMN "deliveryStreet" TEXT NOT NULL DEFAULT '';
ALTER TABLE "orders" ADD COLUMN "deliveryNumber" TEXT NOT NULL DEFAULT '';
ALTER TABLE "orders" ADD COLUMN "deliveryComplement" TEXT;
ALTER TABLE "orders" ADD COLUMN "deliveryDistrict" TEXT;
ALTER TABLE "orders" ADD COLUMN "deliveryCity" TEXT NOT NULL DEFAULT '';
ALTER TABLE "orders" ADD COLUMN "deliveryState" TEXT NOT NULL DEFAULT '';

ALTER TABLE "orders" ALTER COLUMN "shippingAmount" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "deliveryPostalCode" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "deliveryStreet" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "deliveryNumber" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "deliveryCity" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "deliveryState" DROP DEFAULT;
