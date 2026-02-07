import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Seed Recruiter Data
const seedRecruiters = async () => {
  try {
    // Delete ALL existing users (not just recruiters)
    await User.deleteMany({});
    console.log('🗑️  All existing users deleted');

    // Create recruiters
    const recruiters = [
      {
        name: 'John Smith',
        email: 'recruiter@company.com',
        password: 'recruiter123',
        role: 'employer',
        companyName: 'Tech Solutions Inc.',
        companyWebsite: 'https://techsolutions.com'
      },
      {
        name: 'Sarah Johnson',
        email: 'hr@startup.com',
        password: 'recruiter123',
        role: 'employer',
        companyName: 'Innovation Startup',
        companyWebsite: 'https://innovationstartup.com'
      },
      {
        name: 'Admin User',
        email: 'admin@ats.com',
        password: 'admin123',
        role: 'admin',
        companyName: 'ATS Platform'
      }
    ];

    // Create users one by one to trigger password hashing
    for (const recruiterData of recruiters) {
      await User.create(recruiterData);
    }
    
    console.log('✅ Recruiters seeded successfully!');
    
    console.log('\n📋 Recruiter Credentials:');
    console.log('================================');
    recruiters.forEach(recruiter => {
      console.log(`\nName: ${recruiter.name}`);
      console.log(`Email: ${recruiter.email}`);
      console.log(`Password: ${recruiter.password}`);
      console.log(`Role: ${recruiter.role}`);
      console.log(`Company: ${recruiter.companyName}`);
    });
    console.log('\n================================\n');

  } catch (error) {
    console.error('❌ Error seeding recruiters:', error.message);
  }
};

// Run Seeder
const runSeeder = async () => {
  await connectDB();
  await seedRecruiters();
  process.exit();
};

runSeeder();
