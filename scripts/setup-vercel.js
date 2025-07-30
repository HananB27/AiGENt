#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Vercel for automated deployment...\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI not found. Installing...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually:');
    console.error('   npm install -g vercel');
    process.exit(1);
  }
}

// Check if user is logged in
try {
  execSync('vercel whoami', { stdio: 'pipe' });
  console.log('✅ You are logged in to Vercel');
} catch (error) {
  console.log('❌ Not logged in to Vercel. Please login:');
  console.log('   vercel login');
  console.log('\nAfter logging in, run this script again.');
  process.exit(1);
}

// Get Vercel token
console.log('\n🔑 Getting your Vercel token...');
try {
  // Try to list tokens
  const tokenOutput = execSync('vercel token ls', { encoding: 'utf8' });
  console.log('✅ Found existing Vercel tokens');
  console.log(tokenOutput);
  
  console.log('\n🎉 Vercel setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy one of your existing tokens above, or create a new one:');
  console.log('   vercel token add "AI Agent Creator"');
  console.log('2. Add your VERCEL_TOKEN to your .env.local file:');
  console.log('   VERCEL_TOKEN=your_token_here');
  console.log('3. Add your GEMINI_API_KEY to your .env.local file:');
  console.log('   GEMINI_API_KEY=your_gemini_api_key_here');
  console.log('4. Restart your development server');
  console.log('5. Create and deploy your agents!');
  
} catch (error) {
  console.error('❌ Failed to get Vercel token:', error.message);
  console.log('\n📝 Manual setup:');
  console.log('1. Go to https://vercel.com/account/tokens');
  console.log('2. Create a new token');
  console.log('3. Add it to your .env.local file as VERCEL_TOKEN');
}

console.log('\n✨ Your AI Agent Creator is ready for automated deployment!'); 