import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const defaultNotificationEmail = 'spraynandprayn@gmail.com';

const builds: Prisma.BuildCreateInput[] = [
  {
    name: 'Titanium F-Class Dominator',
    description: 'Competition-tuned F-Class platform optimized for repeatable long-range precision.',
    discipline: 'F-Class',
    chassisType: 'McMillan A5',
    caliber: '6.5 Creedmoor',
    imageUrl: 'https://images.unsplash.com/photo-1561994183-94c5f4f86f44?auto=format&fit=crop&w=1400&q=80',
    featured: true,
    specifications: {
      trigger: 'Jewell HVR',
      stock: 'McMillan A5',
      optic: 'Nightforce ATACR',
      barrel: '26" match barrel'
    }
  },
  {
    name: 'PRS Impact Rig',
    description: 'Fast, rugged PRS build with recoil management and rapid positional stability.',
    discipline: 'PRS',
    chassisType: 'KRG Bravo',
    caliber: '6mm Dasher',
    imageUrl: 'https://images.unsplash.com/photo-1550935112-2d0f9f79c8f8?auto=format&fit=crop&w=1400&q=80',
    featured: true,
    specifications: {
      trigger: 'TriggerTech Diamond',
      stock: 'KRG Bravo',
      optic: 'Vortex Razor HD',
      muzzle: 'Match brake'
    }
  },
  {
    name: 'Benchrest Zero Drift',
    description: 'Purpose-built benchrest rifle focused on minimal variance and tiny groups.',
    discipline: 'Benchrest',
    chassisType: 'McMillan Benchrest',
    caliber: '6mm PPC',
    imageUrl: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1400&q=80',
    featured: true,
    specifications: {
      trigger: 'Jewell BR',
      stock: 'McMillan Benchrest',
      optic: 'March 8-80x56',
      tuner: 'Precision harmonic tuner'
    }
  },
  {
    name: 'Long Range Hunter Elite',
    description: 'High-energy hunting package balancing field portability and downrange authority.',
    discipline: 'Long Range Hunter',
    chassisType: 'Carbon hybrid chassis',
    caliber: '300 Win Mag',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-7ef420c8f4f5?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    specifications: {
      barrel: '24" fluted stainless',
      stock: 'Carbon hybrid',
      optic: 'Long-range hunting optic',
      weight: '8.9 lbs'
    }
  },
  {
    name: 'Urban Tactical Sentinel',
    description: 'Duty-ready tactical setup configured for consistency under stress.',
    discipline: 'Tactical',
    chassisType: 'Magpul PRS Gen3',
    caliber: '.308',
    imageUrl: 'https://images.unsplash.com/photo-1518544889280-7f2e7a2f44f5?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    specifications: {
      trigger: 'Geissele Super 700',
      stock: 'Magpul PRS Gen3',
      optic: 'LPVO tactical optic',
      rail: 'Full-length MLOK'
    }
  },
  {
    name: 'Sporting Ridge Runner',
    description: 'Refined sporting rifle for dependable performance with elegant handling.',
    discipline: 'Sporting',
    chassisType: 'Classic composite stock',
    caliber: '.270',
    imageUrl: 'https://images.unsplash.com/photo-1455103493930-a116f655b6c5?auto=format&fit=crop&w=1400&q=80',
    featured: false,
    specifications: {
      barrel: '22" precision contour',
      stock: 'Classic composite',
      optic: 'Variable hunting scope',
      finish: 'Cerakote graphite black'
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

const rssFeeds: Prisma.RssFeedCreateInput[] = [
  {
    name: 'Precision Shooting News',
    url: 'https://example.com/rss/precision-shooting.xml',
    category: 'Industry',
    active: true,
    lastFetchedAt: new Date(),
    items: {
      create: [
        {
          title: 'Regional PRS events set new attendance records',
          url: 'https://example.com/articles/prs-attendance',
          excerpt: 'Growth in participation reflects surging interest in precision disciplines.',
          imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
          publishedAt: new Date('2025-11-01T00:00:00Z')
        },
        {
          title: 'Barrel metallurgy advances improve thermal stability',
          url: 'https://example.com/articles/barrel-metallurgy',
          excerpt: 'Manufacturers publish new test data on thermal consistency.',
          imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
          publishedAt: new Date('2025-10-26T00:00:00Z')
        }
      ]
    }
  },
  {
    name: 'Competitive Rifle Digest',
    url: 'https://example.com/rss/competitive-rifle.xml',
    category: 'Competition',
    active: true,
    lastFetchedAt: new Date(),
    items: {
      create: [
        {
          title: 'F-Class championship preview and equipment trends',
          url: 'https://example.com/articles/fclass-preview',
          excerpt: 'A look at top contenders and gear patterns this season.',
          imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
          publishedAt: new Date('2025-10-18T00:00:00Z')
        }
      ]
    }
  }
];

async function main() {
  await prisma.rssItem.deleteMany();
  await prisma.rssFeed.deleteMany();
  await prisma.order.deleteMany();
  await prisma.pressItem.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.champion.deleteMany();
  await prisma.build.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.settings.create({
    data: {
      notificationEmail: defaultNotificationEmail
    }
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

  for (const feed of rssFeeds) {
    await prisma.rssFeed.create({ data: feed });
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
