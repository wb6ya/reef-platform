"use server";
import { prisma } from "@/lib/prisma";

export async function getCategoriesAction() {
  return await prisma.category.findMany();
}
