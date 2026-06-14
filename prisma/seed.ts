import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');

  // 1. Livestock (مواشي)
  await prisma.category.upsert({
    where: { slug: 'livestock' },
    update: {},
    create: {
      slug: 'livestock',
      name_ar: 'مواشي',
      name_en: 'Livestock',
      schema: [
        { id: 'breed', type: 'text', label_ar: 'السلالة / الصنف', label_en: 'Breed', required: true },
        { id: 'age', type: 'number', label_ar: 'العمر (بالأشهر)', label_en: 'Age (Months)', required: true },
        { id: 'weight', type: 'number', label_ar: 'الوزن التقريبي (كجم)', label_en: 'Approx. Weight (KG)', required: false },
        { id: 'health_status', type: 'select', options_ar: ['ممتاز', 'جيد', 'يحتاج رعاية'], options_en: ['Excellent', 'Good', 'Needs Care'], label_ar: 'الحالة الصحية', label_en: 'Health Status', required: true }
      ]
    }
  });

  // 2. Equipment (معدات زراعية)
  await prisma.category.upsert({
    where: { slug: 'equipment' },
    update: {},
    create: {
      slug: 'equipment',
      name_ar: 'معدات زراعية',
      name_en: 'Equipment',
      schema: [
        { id: 'brand', type: 'text', label_ar: 'الماركة / الشركة المصنعة', label_en: 'Brand', required: true },
        { id: 'condition', type: 'select', options_ar: ['جديد', 'مستعمل - أخو الجديد', 'مستعمل'], options_en: ['New', 'Like New', 'Used'], label_ar: 'الحالة', label_en: 'Condition', required: true },
        { id: 'usage_hours', type: 'number', label_ar: 'ساعات الاستخدام (إن وجد)', label_en: 'Usage Hours (If applicable)', required: false }
      ]
    }
  });

  // 3. Crops & Seeds (محاصيل وبذور)
  await prisma.category.upsert({
    where: { slug: 'crops' },
    update: {},
    create: {
      slug: 'crops',
      name_ar: 'محاصيل وبذور',
      name_en: 'Crops & Seeds',
      schema: [
        { id: 'quantity', type: 'number', label_ar: 'الكمية (كجم/طن)', label_en: 'Quantity (KG/Tons)', required: true },
        { id: 'harvest_date', type: 'text', label_ar: 'تاريخ الحصاد / الإنتاج', label_en: 'Harvest/Production Date', required: false },
        { id: 'is_organic', type: 'select', options_ar: ['نعم', 'لا'], options_en: ['Yes', 'No'], label_ar: 'عضوي؟', label_en: 'Organic?', required: true }
      ]
    }
  });

  console.log('✅ Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
