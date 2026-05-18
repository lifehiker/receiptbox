import { prisma } from "@/lib/prisma";

const DEFAULTS = [
  { name: "Meals", slug: "meals" },
  { name: "Travel", slug: "travel" },
  { name: "Supplies", slug: "supplies" },
  { name: "Office", slug: "office" },
  { name: "Software", slug: "software" },
  { name: "Vehicle", slug: "vehicle" },
  { name: "Other", slug: "other" },
];

export async function ensureDefaultCategories() {
  for (const c of DEFAULTS) {
    const exists = await prisma.category.findFirst({ where: { userId: null, slug: c.slug } });
    if (!exists) {
      await prisma.category.create({
        data: { name: c.name, slug: c.slug, isDefault: true },
      });
    }
  }
}

export async function listCategories() {
  await ensureDefaultCategories();
  return prisma.category.findMany({
    where: { userId: null },
    orderBy: { name: "asc" },
  });
}
