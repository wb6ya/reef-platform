const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding core categories...");

  await prisma.category.deleteMany({});

  const categories = [
    {
      slug: "livestock",
      name_ar: "مواشي",
      name_en: "Livestock",
      schema: [
        { name: "age", label: "العمر (أشهر)", type: "number", required: true },
        { name: "health", label: "الحالة الصحية", type: "text", required: true },
        { name: "breed", label: "السلالة / الصنف", type: "text", required: false }
      ]
    },
    {
      slug: "plants",
      name_ar: "زراعة وشتلات",
      name_en: "Agriculture & Plants",
      schema: [
        { name: "type", label: "نوع النبتة", type: "text", required: true },
        { name: "height", label: "الطول التقريبي (سم)", type: "number", required: false }
      ]
    },
    {
      slug: "equipment",
      name_ar: "معدات زراعية",
      name_en: "Agricultural Equipment",
      schema: [
        { name: "condition", label: "حالة المعدة", type: "select", options: ["جديد", "مستعمل"], required: true },
        { name: "brand", label: "الشركة المصنعة", type: "text", required: false }
      ]
    }
  ];

  for (const cat of categories) {
    await prisma.category.create({
      data: cat
    });
    console.log(`Created category: ${cat.name_en}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
