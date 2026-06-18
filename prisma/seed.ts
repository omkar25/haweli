import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const menuData = [
  {
    category: "Snacks",
    items: [
      { name: "Vegetable Samosas (2 Stück)", description: "Teigtaschen gefüllt mit Kartoffeln, Erbsen und indischen Gewürzen", price: 3.50, isVeg: true },
      { name: "Vegetable Samosas Thali (2 Stück)", description: "Teigtaschen gefüllt mit Kartoffeln, Erbsen und indischen Gewürzen, dazu Kichererbsen", price: 4.00, isVeg: true },
      { name: "Gobi Pakoras", description: "Frittierte Blumenkohlstücke", price: 3.00, isVeg: true },
      { name: "Aloo Pakoras", description: "Frittierte Kartoffeln in Kichererbsenmehl", price: 3.50, isVeg: true },
      { name: "Onion Pakoras", description: "Frittierte Zwiebelringe", price: 3.50, isVeg: true },
      { name: "Palak Pakoras", description: "Gehackte Zwiebeln, Kartoffeln und Spinat (gemischt) frittiert", price: 4.50, isVeg: true },
      { name: "Bombay Sandwich Pakoras (2 Stück)", description: "Toastbrot gefüllt mit Kartoffeln, Erbsen und indischen Gewürzen", price: 4.50, isVeg: true },
      { name: "Paneer Pakoras", description: "Indischer Käse frittiert", price: 5.00, isVeg: true },
      { name: "Chole Bhature Thali", description: "2 frittierte Brote mit Kichererbsen", price: 7.00, isVeg: true },
      { name: "Chole mit Naan Brot", description: "Naan mit Kichererbsen", price: 7.00, isVeg: true },
      { name: "Badshah Pakoras", description: "Versch. Pakoras frittiert in Kichererbsenmehl", price: 8.00, isVeg: true },
    ],
  },
  {
    category: "Vegetarische Gerichte",
    items: [
      { name: "Vegetarian Curry Thali", description: "Gemischtes Gemüse, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 8.00, isVeg: true },
      { name: "Palak Paneer Thali", description: "Frischer Spinat mit hausgemachtem Käse, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: true },
      { name: "Bhindi Thali (Okra)", description: "Vegetarisches Okra Gemüse (nach Saison erhältlich), inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: true },
      { name: "Mattar Paneer Thali", description: "Erbsen mit hausgemachtem Käse in Curry-Sauce, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 9.00, isVeg: true },
      { name: "Aloo Mattar Thali", description: "Kartoffeln mit Erbsen in Curry-Sauce, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 9.00, isVeg: true },
      { name: "Shahi Paneer Thali", description: "Shahi Paneer, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 9.00, isVeg: true },
      { name: "Kadhi Chawal", description: "Kadhi mit Reis", price: 7.00, isVeg: true },
    ],
  },
  {
    category: "Hähnchen-Gerichte",
    items: [
      { name: "Chicken Curry Thali (mit Knochen)", description: "Hähnchenkeule in Currysauce, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 8.00, isVeg: false },
      { name: "Chicken Curry Thali (ohne Knochen)", description: "Hähnchenbrustfilet in Currysauce, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: false },
      { name: "Chili-Chicken Thali", description: "Hähnchenbrustfilet mit Paprika und Zwiebeln (scharf), inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: false },
      { name: "Chicken Tikka Thali", description: "Hähnchenbrustfilet mit Paprika und Zwiebeln, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: false },
      { name: "Butter Chicken Thali", description: "Hähnchenbrustfilet in Butter-Tomaten-Sauce, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: false },
      { name: "Chicken Saag Thali", description: "Hähnchenbrustfilet mit Spinat, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: false },
      { name: "Chicken Jalfrazie Thali", description: "Hähnchen Jalfrazie, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: false },
      { name: "Chicken Do Pyaza Thali", description: "Hähnchen Do Pyaza, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: false },
    ],
  },
  {
    category: "Thali Änderung",
    items: [
      { name: "Statt Naan extra Reis", description: "Naan-Brot wird durch extra Reis ersetzt", price: 0.00, isVeg: true },
      { name: "Statt Reis extra Naan", description: "Reis wird durch extra Naan-Brot ersetzt", price: 1.00, isVeg: true },
      { name: "Statt Naan extra Bhatura", description: "Naan-Brot wird durch Bhatura ersetzt", price: 1.00, isVeg: true },
      { name: "Statt Naan extra Garlic Naan", description: "Naan-Brot wird durch Garlic Naan ersetzt", price: 1.50, isVeg: true },
    ],
  },
  {
    category: "Lamm-Gerichte",
    items: [
      { name: "Lamm Curry Thali", description: "Lammfleisch in Currysauce, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 10.00, isVeg: false },
      { name: "Lamm Saag Thali", description: "Zartes Lammgulasch mit Spinat, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 11.50, isVeg: false },
      { name: "Lamm Jalfrazie Thali", description: "Lamm Jalfrazie, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 11.50, isVeg: false },
      { name: "Badshah Super Thali", description: "Lamm- und Hähnchenbrustfilet (ohne Daal), inkl. Joghurt, Salat, Reis und Naan-Brot", price: 13.00, isVeg: false },
      { name: "Lamm Do Pyaza", description: "Lammfleisch mit gebr. Zwiebeln in Currysauce, inkl. Daal, Joghurt, Salat, Reis und Naan-Brot", price: 11.50, isVeg: false },
    ],
  },
  {
    category: "Biryani-Gerichte",
    items: [
      { name: "Lammfleisch Biryani", description: "Gebratener Reis mit Lammfleisch, gerösteten Mandeln, Rosinen und Cashewkernen", price: 11.50, isVeg: false },
      { name: "Chicken Biryani", description: "Gebratener Reis mit Hähnchen, gerösteten Mandeln, Rosinen und Cashewkernen", price: 11.50, isVeg: false },
      { name: "Vegetable Biryani", description: "Gebratener Reis mit Gemüse, gerösteten Mandeln, Rosinen und Cashewkernen", price: 7.50, isVeg: true },
      { name: "Egg Biryani", description: "Gebratener Reis mit Ei, gerösteten Mandeln, Rosinen und Cashewkernen", price: 7.50, isVeg: false },
    ],
  },
  {
    category: "Beilagen",
    items: [
      { name: "Reis (Portion)", description: "Basmati Reis", price: 4.00, isVeg: true },
      { name: "Linsen (Kl. Schale)", description: "Linsen als Beilage", price: 1.00, isVeg: true },
      { name: "Kichererbsen (Kl. Schale)", description: "Kichererbsen als Beilage", price: 1.00, isVeg: true },
      { name: "Kleiner Salat", description: "Kleiner Salat als Beilage", price: 1.00, isVeg: true },
      { name: "Gemischtes Gemüse (Kl. Schale)", description: "Gemischtes Gemüse als Beilage", price: 1.00, isVeg: true },
      { name: "Bhindi / Okra (Kl. Schale)", description: "Okra Gemüse als Beilage", price: 1.00, isVeg: true },
      { name: "Butter Chicken (Kl. Schale)", description: "Butter Chicken als Beilage", price: 2.50, isVeg: false },
      { name: "Chili Chicken (Kl. Schale)", description: "Chili Chicken als Beilage", price: 3.00, isVeg: false },
      { name: "Chicken Tikka (Kl. Schale)", description: "Chicken Tikka als Beilage", price: 3.00, isVeg: false },
      { name: "Lamm (Kl. Schale)", description: "Lammfleisch als Beilage", price: 3.00, isVeg: false },
      { name: "Palak Paneer (Kl. Schale)", description: "Palak Paneer als Beilage", price: 4.00, isVeg: true },
      { name: "Bhatura (Stk.)", description: "Frittiertes Brot, 1 Stück", price: 1.50, isVeg: true },
      { name: "Naan-Brot (Stk.)", description: "Naan-Brot, 1 Stück", price: 1.50, isVeg: true },
      { name: "Garlic Naan-Brot (Stk.)", description: "Knoblauch Naan-Brot, 1 Stück", price: 3.00, isVeg: true },
    ],
  },
  {
    category: "Desserts",
    items: [
      { name: "Rasmalai (Stk.)", description: "Indisches Milchdessert", price: 5.00, isVeg: true },
      { name: "Laddu (Stk.)", description: "Indische Süßigkeit", price: 5.00, isVeg: true },
      { name: "Gulab Jamun (Stk.)", description: "Frittierte Milchbällchen in Zuckersirup", price: 5.00, isVeg: true },
      { name: "Rasgulla (Stk.)", description: "Weiche Milchbällchen in Zuckersirup", price: 5.00, isVeg: true },
      { name: "Sandpiece (Stk.)", description: "Indisches Sanddessert", price: 7.00, isVeg: true },
      { name: "Lady King (Stk.)", description: "Indische Süßigkeit", price: 5.00, isVeg: true },
    ],
  },
  {
    category: "Heiße Getränke",
    items: [
      { name: "Schwarz-Tee (1 Tasse)", description: "Schwarzer Tee", price: 1.50, isVeg: true },
      { name: "Kamillen-Tee (1 Tasse)", description: "Kamillentee", price: 1.50, isVeg: true },
      { name: "Pfefferminz-Tee (1 Tasse)", description: "Pfefferminztee", price: 1.50, isVeg: true },
      { name: "Grün-Tee (1 Tasse)", description: "Grüner Tee", price: 1.50, isVeg: true },
      { name: "Indischer Tee (1 Tasse)", description: "Tee mit indischen Gewürzen", price: 2.00, isVeg: true },
    ],
  },
  {
    category: "Indische Süßigkeiten-Spezialitäten",
    items: [
      { name: "Jalebi", description: "Knusprige Spiralen in Zuckersirup", price: 0, isVeg: true },
      { name: "Barfi", description: "Indische Milchsüßigkeit", price: 0, isVeg: true },
      { name: "Tooda Barfi", description: "Indische Süßigkeit", price: 0, isVeg: true },
      { name: "Gadjrella", description: "Möhren-Süßigkeit", price: 0, isVeg: true },
      { name: "Wessan", description: "Indische Süßigkeit", price: 0, isVeg: true },
      { name: "Sandpiece", description: "Indische Süßigkeit", price: 0, isVeg: true },
      { name: "Lady King", description: "Indische Süßigkeit", price: 0, isVeg: true },
      { name: "Gulab Jamun", description: "Frittierte Milchbällchen in Zuckersirup", price: 0, isVeg: true },
      { name: "Rasgulla Laddu", description: "Milchbällchen in Zuckersirup mit Laddu", price: 0, isVeg: true },
      { name: "Badana", description: "Indische Süßigkeit", price: 0, isVeg: true },
      { name: "Maa ki Dal ki Pinni", description: "Süßigkeit aus Linsenmehl", price: 0, isVeg: true },
      { name: "Masala Kaju", description: "Gewürzte Cashewkerne", price: 0, isVeg: true },
      { name: "Wessan Pinni", description: "Indische Süßigkeit aus Kichererbsenmehl", price: 0, isVeg: true },
      { name: "Frischer Paneer (Käse)", description: "Hausgemachter indischer Käse", price: 0, isVeg: true },
      { name: "Namkeen Matthi", description: "Salziges Gebäck", price: 0, isVeg: true },
      { name: "Namak Pare", description: "Salzige Teigstücke", price: 0, isVeg: true },
      { name: "Kaju Katli Barfi", description: "Cashew-Süßigkeit", price: 0, isVeg: true },
      { name: "Milk Cake", description: "Milchkuchen", price: 0, isVeg: true },
      { name: "Patisa", description: "Schichtiges Gebäck", price: 0, isVeg: true },
      { name: "Bhujia", description: "Knuspriges Snackgebäck", price: 0, isVeg: true },
    ],
  },
];

const tables = [
  { number: 1, capacity: 2 },
  { number: 2, capacity: 2 },
  { number: 3, capacity: 4 },
  { number: 4, capacity: 4 },
  { number: 5, capacity: 6 },
  { number: 6, capacity: 6 },
  { number: 7, capacity: 8 },
  { number: 8, capacity: 10 },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();

  // Seed categories and menu items
  for (const data of menuData) {
    const category = await prisma.category.create({
      data: {
        name: data.category,
        items: {
          create: data.items.map((item) => ({
            name: item.name,
            description: item.description,
            price: item.price,
            isVeg: item.isVeg,
          })),
        },
      },
    });
    console.log(`  ✅ Created category: ${category.name} (${data.items.length} items)`);
  }

  // Seed tables
  for (const table of tables) {
    await prisma.table.create({ data: table });
  }
  console.log(`  ✅ Created ${tables.length} tables`);

  const totalItems = menuData.reduce((sum, cat) => sum + cat.items.length, 0);
  console.log(`\n🎉 Seeding complete! ${totalItems} menu items + ${tables.length} tables`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
