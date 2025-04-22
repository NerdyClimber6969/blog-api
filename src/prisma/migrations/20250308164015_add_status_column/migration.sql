/*
  Warnings:

  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('drafted', 'published', 'archived', 'banned');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'drafted';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";
