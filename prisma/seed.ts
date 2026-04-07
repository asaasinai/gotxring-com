import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const defaultNotificationEmail = 'spraynandprayn@gmail.com';

const defaultHero = {
  headline: 'Engineered for the Win.',
  subheadline: 'Custom precision rifle systems built for decisive performance across F-Class, PRS, tactical, and long-range hunting disciplines.',
  ctaButtonText: 'Configure Your Build',
  ctaButtonUrl: '/order',
  backgroundImage: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1600&q=80'
};

const builds: Prisma.BuildCreateInput[] = [
  // ── Full Rifle Systems / Centerfire ──────────────────────────────────────
  {
    name: 'Universal Match Rifle System (UMR)',
    description: 'Competition Machine\'s flagship centerfire platform. The UMR is purpose-built for F-Class and long-range precision competition, delivering sub-MOA accuracy with consistent barrel-to-barrel repeatability.',
    category: 'Full Rifle Systems',
    subcategory: 'Centerfire',
    discipline: 'F-Class / Long Range',
    chassisType: 'Custom Competition Stock',
    caliber: '6.5 Creedmoor / 6mm Dasher / .284',
    imageUrl: 'https://images.unsplash.com/photo-1561994183-94c5f4f86f44?auto=format&fit=crop&w=1400&q=80',
    featured: true,
    sortOrder: 1,
    specifications: {
      action: 'Custom billet receiver',
      barrel: 'Match-grade stainless, customer specified',
      trigger: 'Jewell HVR',
      stock: 'Custom competition stock',
      available_calibers: '6.5 Creedmoor, 6mm Dasher, .284 Win'
    }
  },
  {
    name: 'T3 Competition Rifle',
    description: 'Built on the Tikka T3x action, the T3 Competition Rifle is Competition Machine\'s precision PRS platform. Tuned from the factory trigger up, it delivers consistent performance in rapid positional shooting.',
    category: 'Full Rifle Systems',
    subcategory: 'Centerfire',
    discipline: 'PRS / Precision Rifle',
    chassisType: 'KRG / MDT Compatible',
    caliber: '6mm Dasher / 6.5 Creedmoor',
    imageUrl: 'https://images.unsplash.com/photo-1550935112-2d0f9f79c8f8?auto=format&fit=crop&w=1400&q=80',
    featured: true,
    sortOrder: 2,
    specifications: {
      action: 'Tikka T3x (tuned)',
      barrel: 'Match-grade, 24"–26"',
      trigger: 'Factory tuned or upgraded',
      chassis: 'KRG Bravo or customer choice',
      available_calibers: '6mm Dasher, 6.5 Creedmoor, others on request'
    }
  },
  // ── Full Rifle Systems / Rimfire ─────────────────────────────────────────
  {
    name: '2500x Rifle System',
    description: 'Competition Machine\'s dedicated rimfire competition platform. The 2500x is built for precision rimfire disciplines including the NRL22 and PRS Rimfire series — a proper training tool and match winner.',
    category: 'Full Rifle Systems',
    subcategory: 'Rimfire',
    discipline: 'NRL22 / PRS Rimfire',
    chassisType: 'Custom rimfire chassis',
    caliber: '.22 LR',
    imageUrl: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    sortOrder: 1,
    specifications: {
      caliber: '.22 LR',
      action: 'Custom billet rimfire receiver',
      barrel: 'Match-grade rimfire barrel',
      trigger: 'Competition rimfire trigger',
      use_case: 'Off-season training, NRL22, PRS Rimfire'
    }
  },
  {
    name: 'Universal Match Rimfire Rifle System (UMRR)',
    description: 'The rimfire counterpart to the UMR. The UMRR brings the same match-grade attention to detail to .22 LR competition, offering shooters a purpose-built rimfire system for serious competition use.',
    category: 'Full Rifle Systems',
    subcategory: 'Rimfire',
    discipline: 'Rimfire Benchrest / NRL22',
    chassisType: 'Custom match stock',
    caliber: '.22 LR',
    imageUrl: 'https://images.unsplash.com/photo-1455103493930-a116f655b6c5?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    sortOrder: 2,
    specifications: {
      caliber: '.22 LR',
      action: 'Match rimfire action',
      barrel: 'Premium match rimfire barrel',
      stock: 'Custom competition stock',
      use_case: 'Rimfire benchrest, precision rimfire competition'
    }
  },
  // ── Chassis Systems ───────────────────────────────────────────────────────
  {
    name: 'Remington 700 Pattern Chassis',
    description: 'Competition Machine\'s precision chassis built around the Remington 700 footprint. Compatible with a wide range of actions, this chassis delivers a rigid, repeatable bedding solution for serious competitors.',
    category: 'Chassis Systems',
    subcategory: '',
    discipline: 'F-Class / PRS / Benchrest',
    chassisType: 'Billet aluminum',
    caliber: 'Remington 700 SA / LA',
    imageUrl: 'https://images.unsplash.com/photo-1518544889280-7f2e7a2f44f5?auto=format&fit=crop&w=1400&q=80',
    featured: true,
    sortOrder: 1,
    specifications: {
      inlet: 'Remington 700 Short Action / Long Action',
      material: 'Billet 6061-T6 aluminum',
      finish: 'Cerakote, customer specified',
      compatibility: 'Most Rem 700 pattern actions',
      available_in: 'Standard and thumbhole configurations'
    }
  },
  {
    name: 'Tikka T3 Chassis',
    description: 'Precision chassis system inletted specifically for the Tikka T3/T3x action. Pairs with the T3 Competition Rifle build or is available standalone for shooters wanting to upgrade their existing T3.',
    category: 'Chassis Systems',
    subcategory: '',
    discipline: 'PRS / Precision Rifle',
    chassisType: 'Billet aluminum',
    caliber: 'Tikka T3 / T3x',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-7ef420c8f4f5?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    sortOrder: 2,
    specifications: {
      inlet: 'Tikka T3 / T3x',
      material: 'Billet 6061-T6 aluminum',
      finish: 'Cerakote, customer specified',
      compatibility: 'Tikka T3, T3x (all barrel profiles)',
      available_in: 'Standard and thumbhole configurations'
    }
  },
  {
    name: 'Barnard Model P Chassis',
    description: 'Chassis system built around the Barnard Model P action — one of the most accurate production actions available. Designed for benchrest and long-range F-Class competition shooters who demand maximum precision.',
    category: 'Chassis Systems',
    subcategory: '',
    discipline: 'Benchrest / F-Class',
    chassisType: 'Billet aluminum',
    caliber: 'Barnard Model P',
    imageUrl: 'https://images.unsplash.com/photo-1561994183-94c5f4f86f44?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    sortOrder: 3,
    specifications: {
      inlet: 'Barnard Model P',
      material: 'Billet 6061-T6 aluminum',
      finish: 'Cerakote, customer specified',
      use_case: 'Benchrest, F-Class long range',
      compatibility: 'Barnard Model P (single shot and repeater)'
    }
  }
];

const champions: Prisma.ChampionCreateInput[] = [
  {
    name: 'Sarah Mitchell',
    title: 'F-Class National Champion',
    quote: 'Consistency under pressure is engineered, not accidental.',
    imageUrl: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=900&q=80',
    achievements: 'National podium finishes across three consecutive seasons.',
    loadout: '6.5 Creedmoor competition setup',
    featured: true
  },
  {
    name: 'Marcus Rodriguez',
    title: 'PRS Pro',
    quote: 'Speed means nothing without repeatable impacts.',
    imageUrl: 'https://images.unsplash.com/photo-1506277886988-58a29ed2b1be?auto=format&fit=crop&w=900&q=80',
    achievements: 'Top PRS circuit finisher and multi-stage winner.',
    loadout: '6mm Dasher PRS rig',
    featured: true
  },
  {
    name: 'Emily Thompson',
    title: 'Long Range Specialist',
    quote: 'Wind calls are data plus discipline.',
    imageUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80',
    achievements: 'Long-range instructional leader and field champion.',
    loadout: '300 Win Mag long-range hunter',
    featured: false
  },
  {
    name: 'David Chen',
    title: 'Tactical Expert',
    quote: 'Reliability is the first performance metric.',
    imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=900&q=80',
    achievements: 'Tactical invitational winner and precision trainer.',
    loadout: '.308 tactical platform',
    featured: false
  },
  {
    name: 'Jessica Morgan',
    title: 'Benchrest World Record',
    quote: 'Perfection is built from measurable details.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    achievements: 'World-record benchrest group performance.',
    loadout: '6mm PPC benchrest rig',
    featured: true
  }
];

const blogPosts: Prisma.BlogPostCreateInput[] = [
  {
    title: 'Science of Precision: MOA vs MIL',
    content: 'Understanding angular measurement systems is critical for effective correction under real-world conditions. This guide breaks down where MOA and MIL each shine, and how to train with either system without introducing conversion errors.',
    excerpt: 'A practical breakdown of MOA and MIL for precision shooters.',
    slug: 'science-of-precision-moa-vs-mil',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80',
    published: true,
    author: 'Competition Machine Editorial',
    sourceUrl: 'https://gotxring.com',
    publishedAt: new Date()
  },
  {
    title: 'Custom Rifle Build Process',
    content: 'Every custom rifle begins with mission-specific decisions. From action and barrel profile to stock geometry and trigger tuning, this post explains how our process translates shooter goals into measurable outcomes.',
    excerpt: 'Inside our step-by-step workflow for world-class custom rifle builds.',
    slug: 'custom-rifle-build-process',
    category: 'Build Process',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80',
    published: true,
    author: 'Competition Machine Editorial',
    sourceUrl: 'https://gotxring.com',
    publishedAt: new Date()
  },
  {
    title: 'Barrel Break-In Procedures',
    content: 'Barrel preparation can influence consistency over the first match cycles. We cover realistic break-in routines, cleaning intervals, and what data to log so your rifle settles quickly without over-cleaning.',
    excerpt: 'A no-nonsense approach to barrel break-in for lasting consistency.',
    slug: 'barrel-break-in-procedures',
    category: 'Maintenance',
    imageUrl: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80',
    published: true,
    author: 'Competition Machine Editorial',
    sourceUrl: 'https://gotxring.com',
    publishedAt: new Date()
  }
];

const pressItems: Prisma.PressItemCreateInput[] = [
  {
    title: 'Competition Machine Spotlighted for Precision Innovation',
    publication: 'Precision Shooting Journal',
    url: 'https://example.com/precision-journal-gotxring',
    imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&q=80',
    publishedAt: new Date('2025-10-05T00:00:00Z'),
    category: 'Feature',
    featured: true
  },
  {
    title: 'Top Builders to Watch in Competitive Long Range',
    publication: 'Range Sports Weekly',
    url: 'https://example.com/range-sports-builders',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    publishedAt: new Date('2025-09-12T00:00:00Z'),
    category: 'Industry',
    featured: false
  },
  {
    title: 'How Competition Machine Tunes Chassis Dynamics',
    publication: 'Tactical Rifle Review',
    url: 'https://example.com/tactical-rifle-dynamics',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    publishedAt: new Date('2025-08-20T00:00:00Z'),
    category: 'Technical',
    featured: true
  }
];

async function main() {
  await prisma.order.deleteMany();
  await prisma.pressItem.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.champion.deleteMany();
  await prisma.build.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.hero.deleteMany();

  await prisma.settings.create({
    data: {
      notificationEmail: defaultNotificationEmail
    }
  });

  await prisma.hero.create({
    data: defaultHero
  });

  for (const build of builds) {
    await prisma.build.create({ data: build });
  }

  for (const champion of champions) {
    await prisma.champion.create({ data: champion });
  }

  for (const blogPost of blogPosts) {
    await prisma.blogPost.create({ data: blogPost });
  }

  for (const pressItem of pressItems) {
    await prisma.pressItem.create({ data: pressItem });
  }

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
