/*
  Warnings:

  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_TagToTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_TagToTransaction" DROP CONSTRAINT "_TagToTransaction_A_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tag_id_seq";

-- AlterTable
ALTER TABLE "_TagToTransaction" DROP CONSTRAINT "_TagToTransaction_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_TagToTransaction_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "_TagToTransaction" ADD CONSTRAINT "_TagToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
