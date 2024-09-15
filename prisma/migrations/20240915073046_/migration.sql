/*
  Warnings:

  - You are about to drop the column `productSnapshot` on the `product_variant` table. All the data in the column will be lost.
  - Added the required column `variantSnapshot` to the `order` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_id` on table `product_variant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_product_id_fkey";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "variantSnapshot" JSONB NOT NULL,
ALTER COLUMN "variant_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "productSnapshot",
ALTER COLUMN "product_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
