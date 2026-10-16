import { PrismaClient, Gender, VideoCategory, VideoOrientation, ReviewStatus, LeadStatus } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

async function createSampleImage(color: { r: number; g: number; b: number }, width = 800, height = 1000) {
  const buf = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { ...color, alpha: 1 },
    },
  })
    .webp({ quality: 80 })
    .toBuffer();

  const img = await prisma.image.create({
    data: {
      data: new Uint8Array(buf),
      mimeType: "image/webp",
      sizeBytes: buf.length,
      width,
      height,
    },
  });
  return img.id;
}

async function main() {
  console.log("🌱 Starting BrandsWave database seed...");

  // 1. Seed About Content (singleton id = 1)
  console.log("Seeding About content...");
  await prisma.aboutContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      vision:
        "To position Bangladesh as a preeminent hub for premier fashion editorial talents, high-impact television commercials, and avant-garde cinematic storytelling on the international stage.",
      mission:
        "BrandsWave is dedicated to discovering, mentoring, and representing exceptional talent while delivering turnkey commercial and digital video production services for the world's most discerning brands.",
    },
    update: {
      vision:
        "To position Bangladesh as a preeminent hub for premier fashion editorial talents, high-impact television commercials, and avant-garde cinematic storytelling on the international stage.",
      mission:
        "BrandsWave is dedicated to discovering, mentoring, and representing exceptional talent while delivering turnkey commercial and digital video production services for the world's most discerning brands.",
    },
  });

  // 2. Seed Sample Images
  console.log("Creating placeholder portfolio images...");
  const img1 = await createSampleImage({ r: 28, g: 53, b: 86 }); // Swell blue
  const img2 = await createSampleImage({ r: 18, g: 35, b: 59 }); // Tide
  const img3 = await createSampleImage({ r: 134, g: 217, b: 198 }); // Glass
  const img4 = await createSampleImage({ r: 216, g: 199, b: 165 }); // Sand
  const img5 = await createSampleImage({ r: 40, g: 60, b: 80 });

  // 3. Seed Models with measurements, private contact, photos, and videos
  console.log("Seeding models...");
  const existingZara = await prisma.model.findUnique({ where: { slug: "zara-ahmed" } });
  if (!existingZara) {
    await prisma.model.create({
      data: {
        name: "Zara Ahmed",
        slug: "zara-ahmed",
        gender: Gender.FEMALE,
        heightCm: 178,
        chestBust: 86,
        waist: 61,
        hips: 89,
        eyeColor: "Dark Brown",
        hairColor: "Black",
        bio: "Leading haute-couture and runway talent based in Dhaka. Featured in national fashion weeks, Vogue runway showcases, and premier cosmetic campaigns across South Asia.",
        coverImageId: img1,
        isFeatured: true,
        isPublished: true,
        private: {
          create: {
            phone: "+880 1711 002233",
            email: "zara.exclusive@gmail.com",
          },
        },
        photos: {
          create: [
            { imageId: img1, sortOrder: 0 },
            { imageId: img2, sortOrder: 1 },
            { imageId: img3, sortOrder: 2 },
          ],
        },
        videos: {
          create: [
            {
              title: "Apex Spring Haute Couture Reel",
              description: "Lead runway model for seasonal fashion showcase",
              youtubeUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
              sortOrder: 0,
            },
          ],
        },
      },
    });
  }

  const existingRahim = await prisma.model.findUnique({ where: { slug: "rahim-chowdhury" } });
  if (!existingRahim) {
    await prisma.model.create({
      data: {
        name: "Rahim Chowdhury",
        slug: "rahim-chowdhury",
        gender: Gender.MALE,
        heightCm: 186,
        chestBust: 102,
        waist: 78,
        hips: 96,
        eyeColor: "Amber Brown",
        hairColor: "Dark Brown",
        bio: "Versatile editorial and television commercial lead. Starred in national telecom, lifestyle, and sportswear campaigns throughout the region.",
        coverImageId: img2,
        isFeatured: true,
        isPublished: true,
        private: {
          create: {
            phone: "+880 1819 445566",
            email: "rahim.management@gmail.com",
          },
        },
        photos: {
          create: [
            { imageId: img2, sortOrder: 0 },
            { imageId: img4, sortOrder: 1 },
          ],
        },
        videos: {
          create: [
            {
              title: "Grameenphone Brand Commercial",
              description: "Lead actor in national television commercial campaign",
              youtubeUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
              sortOrder: 0,
            },
          ],
        },
      },
    });
  }

  const existingMehnaz = await prisma.model.findUnique({ where: { slug: "mehnaz-karim" } });
  if (!existingMehnaz) {
    await prisma.model.create({
      data: {
        name: "Mehnaz Karim",
        slug: "mehnaz-karim",
        gender: Gender.FEMALE,
        heightCm: 175,
        chestBust: 84,
        waist: 63,
        hips: 91,
        eyeColor: "Hazel",
        hairColor: "Brunette",
        bio: "Specializing in high-fashion editorial print, beauty portraits, and luxury jewellery brand commercials.",
        coverImageId: img3,
        isFeatured: true,
        isPublished: true,
        private: {
          create: {
            phone: "+880 1912 334455",
            email: "mehnaz.agent@outlook.com",
          },
        },
        photos: {
          create: [{ imageId: img3, sortOrder: 0 }],
        },
      },
    });
  }

  // 4. Seed Services
  console.log("Seeding services...");
  const services = [
    {
      title: "Commercial & TVC Video Production",
      slug: "commercial-tvc-production",
      description:
        "Full-cycle commercial production from creative scriptwriting and talent casting to 4K cinematography, visual effects, and professional post-production sound mastering.",
      priceMin: 120000,
      priceMax: 450000,
      hidePrice: false,
      sortOrder: 0,
      imageId: img4,
    },
    {
      title: "Fashion & Editorial Talent Casting",
      slug: "fashion-editorial-casting",
      description:
        "Direct access to Dhaka's top roster of verified fashion models, runway talents, voice actors, and brand ambassadors for seasonal campaigns and fashion weeks.",
      priceMin: 40000,
      priceMax: 180000,
      hidePrice: false,
      sortOrder: 1,
      imageId: img1,
    },
    {
      title: "Social Media Reels & Digital Films",
      slug: "social-media-reels-digital-films",
      description:
        "Vertical 9:16 cinematography engineered for viral impact on Instagram, TikTok, and YouTube Shorts. Complete with stylized color grading and sound design.",
      priceMin: 35000,
      priceMax: 95000,
      hidePrice: false,
      sortOrder: 2,
      imageId: img2,
    },
    {
      title: "Bespoke Creative Brand Consulting",
      slug: "creative-brand-consulting",
      description:
        "Comprehensive brand positioning, visual identity styling, and creative direction tailored for emerging luxury brands and enterprise enterprises.",
      priceMin: null,
      priceMax: null,
      hidePrice: true,
      sortOrder: 3,
      imageId: img5,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: s,
      update: s,
    });
  }

  // 5. Seed Portfolio Videos
  console.log("Seeding portfolio videos...");
  const videos = [
    {
      title: "Apex Festive Footwear Television Commercial",
      youtubeId: "dQw4w9WgXcQ",
      category: VideoCategory.TVC,
      orientation: VideoOrientation.LANDSCAPE_16_9,
      isFeatured: true,
    },
    {
      title: "Sailor Summer Runway & Editorial Film",
      youtubeId: "dQw4w9WgXcQ",
      category: VideoCategory.FASHION_SHOOT,
      orientation: VideoOrientation.LANDSCAPE_16_9,
      isFeatured: true,
    },
    {
      title: "Urban Streetwear Brand Launch (Reels Cut)",
      youtubeId: "dQw4w9WgXcQ",
      category: VideoCategory.SOCIAL_MEDIA,
      orientation: VideoOrientation.VERTICAL_9_16,
      isFeatured: true,
    },
    {
      title: "Grameenphone 5G Innovation Story",
      youtubeId: "dQw4w9WgXcQ",
      category: VideoCategory.COMMERCIAL,
      orientation: VideoOrientation.LANDSCAPE_16_9,
      isFeatured: true,
    },
  ];

  for (const v of videos) {
    const existing = await prisma.video.findFirst({ where: { title: v.title } });
    if (!existing) {
      await prisma.video.create({ data: v });
    }
  }

  // 6. Seed Reviews (both approved and pending)
  console.log("Seeding client reviews...");
  const existingReviews = await prisma.review.count();
  if (existingReviews === 0) {
    await prisma.review.createMany({
      data: [
        {
          clientName: "Tariqul Islam",
          designation: "Head of Marketing",
          company: "Apex Footwear Ltd.",
          rating: 5,
          text: "BrandsWave exceeded all benchmarks for our nationwide festive campaign. Their talent selection was spot on and delivery was flawlessly executed ahead of schedule.",
          status: ReviewStatus.APPROVED,
        },
        {
          clientName: "Farzana Chowdhury",
          designation: "Creative Director",
          company: "Aarong Heritage",
          rating: 5,
          text: "The sheer professionalism of the models and cinematography crew set a new bar for fashion productions in Bangladesh. We look forward to ongoing collaborations.",
          status: ReviewStatus.APPROVED,
        },
        {
          clientName: "Asif Mahmud",
          designation: "Brand Lead",
          company: "Sailor Fashion",
          rating: 5,
          text: "High-energy models and cinematic quality video that translated directly into our highest engaging digital campaigns of the fiscal year.",
          status: ReviewStatus.APPROVED,
        },
        {
          clientName: "Nusrat Jahan",
          designation: "Communications Manager",
          company: "Daraz Bangladesh",
          rating: 4,
          text: "Great experience working with the BrandsWave casting team for our 11.11 television commercial shoots. Prompt responses and skilled talent.",
          status: ReviewStatus.PENDING,
        },
      ],
    });
  }

  // 7. Seed Team Members
  console.log("Seeding executive team members...");
  const existingTeam = await prisma.teamMember.count();
  if (existingTeam === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: "Kamrul Hasan",
          role: "Founder & Executive Director",
          photoId: img1,
          phone: "+880 1301 217936",
          email: "brandswaveglobal@gmail.com",
          facebook: "https://www.facebook.com/brandswave",
          linkedin: "https://www.linkedin.com/company/brandswave",
          showPhone: true,
          showEmail: true,
          sortOrder: 0,
          isPublished: true,
        },
        {
          name: "Sabrina Siddique",
          role: "Chief Casting Director & Stylist",
          photoId: img3,
          phone: "+880 1712 998877",
          email: "casting@brandswave.com",
          instagram: "https://www.instagram.com/brandswave",
          showPhone: false,
          showEmail: true,
          sortOrder: 1,
          isPublished: true,
        },
      ],
    });
  }

  // 8. Seed Sample Leads
  console.log("Seeding initial inquiries...");
  const existingLeads = await prisma.lead.count();
  if (existingLeads === 0) {
    await prisma.lead.createMany({
      data: [
        {
          name: "Samiul Alam",
          phone: "+8801712345678",
          email: "samiul@enterprise-bd.com",
          projectBrief: "Looking for 4 editorial models (2 male, 2 female) for our upcoming Winter 2026 apparel catalog and video shoot in Gulshan studio.",
          source: "contact-form",
          status: LeadStatus.NEW,
          ipHash: "dummy-ip-hash-1",
        },
        {
          name: "Nabila Haque",
          phone: "+8801819876543",
          email: "nabila.h@techbrand.com",
          projectBrief: "Requesting a quote for a 60-second TV commercial and 3 social media reels promoting our fintech mobile app.",
          source: "contact-form",
          status: LeadStatus.CONTACTED,
          ipHash: "dummy-ip-hash-2",
        },
      ],
    });
  }

  console.log("✅ BrandsWave database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
