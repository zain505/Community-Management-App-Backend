import fs from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '../src/generated/prisma';
import { env } from '../src/config/env';

const prisma = new PrismaClient();
const seedStoreImageFilename = 'seed-store.jpg';
const seedStoreImagePublicPath = `/uploads/store-images/${seedStoreImageFilename}`;
const seedStoreImageBase64 = [
  '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQ',
  'ERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU',
  'FBQUFBQUFBQUFBQUFBT/wAARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAA',
  'AgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6',
  'Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG',
  'x8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREA',
  'AgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5',
  'OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPE',
  'xcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDCr9Uq/Pf/AIZv+Iv/AELv/k7bf/HK+/v7',
  'Ttv+ev8A46f8K+fyejUpe09pFq9t1bufpHG+Mw2L+rfV6sZ2578rTtfl3sflvX6pV+e//DN/xF/6F3/ydtv/AI5X39/adt/z',
  '1/8AHT/hRk9GpS9p7SLV7bq3cON8ZhsX9W+r1Yztz35Wna/LvY/Lev1Sr89/+Gb/AIi/9C7/AOTtt/8AHK+/v7Ttv+ev/jp/',
  'woyejUpe09pFq9t1buHG+Mw2L+rfV6sZ2578rTtfl3sYNVv7Ts/+fuD/AL+D/GrNeb19rhqCr3u7WPxzF4p4blsr3ud//adn',
  '/wA/cH/fwf40f2nZ/wDP3B/38H+NcBRXb9Qj/Med/ac/5Ud//adn/wA/cH/fwf41ZrzevSK4sTQVC1ne56OExTxPNdWtYK8i',
  '8WarNoPhXWdTt1R57KymuY1kBKlkQsAcEHGR6ivXa8V+I/8AyTzxR/2C7r/0S1bYRtQqNdv8znx6UqlJPv8A5Hzv/wANV+LP',
  '+gdov/fib/47R/w1X4s/6B2i/wDfib/47XjNFfO/XsT/ADs+q/s7Cf8APtH334T1WbXvCujancKiT3tlDcyLGCFDOgYgZJOM',
  'n1Neu14r8OP+SeeF/wDsF2v/AKJWvaq+ixbbhTb7f5HyuASVSql3/wAz/9k=',
].join('');

async function ensureSeedStoreImage(): Promise<string> {
  const uploadDir = path.resolve(__dirname, '../uploads/store-images');
  const imagePath = path.join(uploadDir, seedStoreImageFilename);

  await fs.mkdir(uploadDir, { recursive: true });

  try {
    const stats = await fs.stat(imagePath);
    if (stats.isFile() && stats.size > 0) {
      return new URL(seedStoreImagePublicPath, env.PUBLIC_BASE_URL).toString();
    }
  } catch {
    // The seed asset is runtime data; create it when the uploads volume is empty.
  }

  await fs.writeFile(imagePath, Buffer.from(seedStoreImageBase64, 'base64'));

  return new URL(seedStoreImagePublicPath, env.PUBLIC_BASE_URL).toString();
}

async function main(): Promise<void> {
  const ownerUserId = 'seed-user-1';
  const seedStoreImageUrl = await ensureSeedStoreImage();
  const category = await prisma.category.upsert({
    where: {
      name: 'General Store',
    },
    update: {},
    create: {
      name: 'General Store',
    },
  });
  const existing = await prisma.store.findUnique({ where: { ownerUserId } });

  if (existing) {
    if (existing.image !== seedStoreImageUrl) {
      await prisma.store.update({
        where: { ownerUserId },
        data: {
          image: seedStoreImageUrl,
        },
      });
    }

    return;
  }

  await prisma.store.create({
    data: {
      ownerUserId,
      name: 'Seed Store',
      location: 'Karachi',
      rating: '0',
      image: seedStoreImageUrl,
      badges: ['Seed', 'Demo'],
      delivery: '25-35 min',
      minOrderRs: '500',
      openingTime: '09:00',
      closingTime: '22:00',
      phoneNumber: '+923000000000',
      category: {
        connect: {
          id: category.id,
        },
      },
      products: {
        create: [
          {
            name: 'Milk 1L',
            price: '320',
            image: 'https://example.com/products/milk.jpg',
            tag: 'Dairy',
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
