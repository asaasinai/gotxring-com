import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type GroupSpec = {
  name: string;
  description: string;
  sortOrder: number;
  items: string[];
};

const GROUPS: GroupSpec[] = [
  {
    name: 'Forend',
    description: 'Slot pattern on the forend',
    sortOrder: 1,
    items: ['Angle slot pattern', 'Stagger slot pattern'],
  },
  {
    name: 'Lower Unit',
    description: 'Lower receiver / magwell configuration',
    sortOrder: 2,
    items: [
      'Standard single shot',
      'Pro adjustable grip single shot',
      'AICS magwell',
      'R5 magwell',
    ],
  },
  {
    name: 'Cheekpiece',
    description: 'Cheekpiece / comb style',
    sortOrder: 3,
    items: ['Radius cantilever', 'Horizontally adjustable', 'Ambidextrous'],
  },
  {
    name: 'Forend Attachments',
    description: 'Forend-mounted attachments (multi-select)',
    sortOrder: 4,
    items: [
      'Ergo handstop',
      'Forward picatinny accessory rail',
      'ARCS Swiss accessory rail',
      'Picklefork bag riders',
    ],
  },
  {
    name: 'Rear Attachments',
    description: 'Rear / buttstock attachments (multi-select)',
    sortOrder: 5,
    items: ['Balance weights', 'Tac bag rider', 'F class bag rider'],
  },
];

async function main() {
  for (const spec of GROUPS) {
    const existing = await prisma.configOptionGroup.findFirst({ where: { name: spec.name } });
    const group = existing
      ? await prisma.configOptionGroup.update({
          where: { id: existing.id },
          data: {
            description: spec.description,
            sortOrder: spec.sortOrder,
            active: true,
          },
        })
      : await prisma.configOptionGroup.create({
          data: {
            name: spec.name,
            description: spec.description,
            sortOrder: spec.sortOrder,
            active: true,
          },
        });

    for (let i = 0; i < spec.items.length; i++) {
      const label = spec.items[i];
      const item = await prisma.configOptionItem.findFirst({
        where: { groupId: group.id, label },
      });
      if (item) {
        await prisma.configOptionItem.update({
          where: { id: item.id },
          data: { sortOrder: i + 1 },
        });
      } else {
        await prisma.configOptionItem.create({
          data: {
            groupId: group.id,
            label,
            description: '',
            sortOrder: i + 1,
          },
        });
      }
    }

    console.log(`✔ ${spec.name} — ${spec.items.length} items`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
