import { PrismaClient, ArticleStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../lib/slugify";

const prisma = new PrismaClient();

function tiptapDoc(paragraphs: string[]) {
  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  };
}

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Şehir Gündemi",
      tagline: "Bölgenizden ilk elden haberler",
      themeColor: "#c81e1e",
    },
  });

  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@haber-sitesi.local" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@haber-sitesi.local",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const categoryNames = ["Gündem", "Ekonomi", "Spor", "Yerel"];
  const categories = await Promise.all(
    categoryNames.map((name, index) =>
      prisma.category.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: { name, slug: slugify(name), sortOrder: index },
      })
    )
  );

  const sampleArticles = [
    {
      title: "Şehir merkezinde yeni ulaşım hattı hizmete girdi",
      excerpt:
        "Belediye, yoğun trafiği azaltmak amacıyla planlanan yeni otobüs hattını bugün itibarıyla hizmete açtı.",
      category: categories[0],
      paragraphs: [
        "Belediye Başkanlığı tarafından aylardır sürdürülen çalışmalar sonuçlandı ve şehir merkezini banliyölere bağlayan yeni otobüs hattı bugün hizmete girdi.",
        "Yetkililer, hattın özellikle sabah ve akşam saatlerindeki yoğunluğu önemli ölçüde azaltmasının beklendiğini belirtti.",
      ],
    },
    {
      title: "Yerel üreticilerden ihracat rekoru",
      excerpt:
        "Bölge esnafı ve üreticileri, bu yılki ihracat rakamlarıyla son beş yılın en yüksek seviyesine ulaştı.",
      category: categories[1],
      paragraphs: [
        "Ticaret Odası verilerine göre bölgedeki küçük ve orta ölçekli işletmelerin ihracatı geçen yıla oranla %18 arttı.",
        "Uzmanlar, artışın büyük ölçüde tarım ürünleri ve tekstil sektöründen kaynaklandığını ifade etti.",
      ],
    },
    {
      title: "Şehir takımı deplasmanda 3 puanı 3 golle aldı",
      excerpt:
        "Haftanın öne çıkan mücadelesinde sahadan galip ayrılan takım, ligde play-off hattına yaklaştı.",
      category: categories[2],
      paragraphs: [
        "Karşılaşmanın ilk yarısını 2-0 önde tamamlayan ekip, ikinci yarıda bulduğu golle skoru 3-0 yaptı.",
        "Teknik direktör maç sonrası yaptığı açıklamada takımın son haftalardaki yükselen performansına dikkat çekti.",
      ],
    },
    {
      title: "Mahalle pazarına yeni düzenleme geliyor",
      excerpt:
        "Esnaf ve sakinlerin talepleri doğrultusunda pazar yerinin düzenlenmesi için çalışma başlatıldı.",
      category: categories[3],
      paragraphs: [
        "Muhtarlık ve belediye ekipleri, pazar alanının daha düzenli ve erişilebilir hale getirilmesi için ortak bir plan üzerinde çalışıyor.",
        "Yeni düzenlemenin önümüzdeki ay itibarıyla uygulamaya konması planlanıyor.",
      ],
    },
    {
      title: "Kütüphaneye yeni okuma salonu eklendi",
      excerpt:
        "Şehir kütüphanesi, artan talep üzerine 200 kişilik yeni bir sessiz çalışma salonunu ziyarete açtı.",
      category: categories[0],
      paragraphs: [
        "Yeni salon, özellikle sınav dönemlerinde öğrencilerin yoğun ilgi gösterdiği kütüphanenin kapasite sorununu çözmeyi hedefliyor.",
        "Kütüphane müdürü, salonun 7 gün 24 saat açık kalacağını duyurdu.",
      ],
    },
  ];

  for (const item of sampleArticles) {
    const slug = slugify(item.title);
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        title: item.title,
        slug,
        excerpt: item.excerpt,
        contentJson: tiptapDoc(item.paragraphs),
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: item.category.id,
      },
    });
  }

  console.log("Seed tamamlandı. Giriş: admin@haber-sitesi.local / admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
