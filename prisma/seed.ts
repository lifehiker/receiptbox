import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: "Meals", slug: "meals" },
  { name: "Travel", slug: "travel" },
  { name: "Supplies", slug: "supplies" },
  { name: "Office", slug: "office" },
  { name: "Software", slug: "software" },
  { name: "Vehicle", slug: "vehicle" },
  { name: "Other", slug: "other" },
];

async function main() {
  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { userId: null, slug: cat.slug },
    });
    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          isDefault: true,
        },
      });
    }
  }
  console.log("Seeded default categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
