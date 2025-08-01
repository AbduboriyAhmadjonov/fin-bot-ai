import { PrismaClient } from '@prisma/client';
import { ensureDefaultCategories } from '../src/services/categoryService.js';

/**
 * Script to seed default categories for all users
 * This script can be run as a standalone CLI tool: node scripts/seedDefaultCategories.js
 */
async function seedDefaultCategoriesForAllUsers() {
  const prisma = new PrismaClient();

  try {
    console.log('🌱 Starting to seed default categories for all users...');

    // Get all users
    const users = await prisma.user.findMany();
    console.log(`📋 Found ${users.length} users.`);

    if (users.length === 0) {
      console.log('❌ No users found in the database.');
      return;
    }

    // Create default categories for each user
    for (const user of users) {
      console.log(`👤 Processing user: ${user.firstName} (ID: ${user.id})`);
      await ensureDefaultCategories(user.id);
    }

    console.log('✅ Default categories have been created for all users.');
  } catch (error) {
    console.error('❌ Error seeding default categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly (node scripts/seedDefaultCategories.js)
if (process.argv[1].includes('seedDefaultCategories')) {
  seedDefaultCategoriesForAllUsers()
    .then(() => {
      console.log('✅ Seed script completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    });
}

export default seedDefaultCategoriesForAllUsers;
