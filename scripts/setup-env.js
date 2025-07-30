#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 AI Agent Environment Setup\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  try {
    console.log('This script will help you set up the required environment variables for your AI agents.\n');
    
    // Check if .env file exists
    const envPath = path.join(process.cwd(), '.env');
    const envExists = fs.existsSync(envPath);
    
    if (envExists) {
      console.log('✅ Found existing .env file');
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      if (envContent.includes('GEMINI_API_KEY=')) {
        console.log('✅ GEMINI_API_KEY is already configured');
      } else {
        console.log('⚠️  GEMINI_API_KEY is missing from .env file');
      }
    } else {
      console.log('📝 Creating new .env file');
    }
    
    // Get Gemini API Key
    console.log('\n🔑 Gemini API Key Setup:');
    console.log('1. Go to https://makersuite.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Copy the API key\n');
    
    const apiKey = await question('Enter your Gemini API Key: ');
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('❌ API key is required. Please run the script again.');
      process.exit(1);
    }
    
    // Prepare environment content
    let envContent = '';
    
    if (envExists) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update existing GEMINI_API_KEY or add new one
      if (envContent.includes('GEMINI_API_KEY=')) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${apiKey}`);
      } else {
        envContent += `\nGEMINI_API_KEY=${apiKey}`;
      }
    } else {
      envContent = `# AI Agent Environment Variables
GEMINI_API_KEY=${apiKey}

# Optional: Vercel Token (for automated deployments)
# VERCEL_TOKEN=your_vercel_token_here
`;
    }
    
    // Write to .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment variables saved to .env file');
    
    // Vercel setup instructions
    console.log('\n🚀 Vercel Deployment Setup:');
    console.log('To deploy your agents to Vercel, you need to:');
    console.log('1. Go to your Vercel dashboard');
    console.log('2. Navigate to your project settings');
    console.log('3. Go to "Environment Variables"');
    console.log('4. Add GEMINI_API_KEY with your API key');
    console.log('5. Redeploy your application\n');
    
    const setupVercel = await question('Would you like to set up Vercel environment variables now? (y/n): ');
    
    if (setupVercel.toLowerCase() === 'y' || setupVercel.toLowerCase() === 'yes') {
      console.log('\n📋 Vercel CLI Setup:');
      console.log('1. Install Vercel CLI: npm i -g vercel');
      console.log('2. Login to Vercel: vercel login');
      console.log('3. Link your project: vercel link');
      console.log('4. Add environment variable: vercel env add GEMINI_API_KEY');
      console.log('5. Redeploy: vercel --prod\n');
      
      const useCLI = await question('Would you like to use Vercel CLI to set up environment variables? (y/n): ');
      
      if (useCLI.toLowerCase() === 'y' || useCLI.toLowerCase() === 'yes') {
        console.log('\n🔧 Setting up Vercel environment variables...');
        
        // Check if vercel CLI is installed
        const { execSync } = require('child_process');
        
        try {
          // Check if vercel is installed
          execSync('vercel --version', { stdio: 'ignore' });
          console.log('✅ Vercel CLI is installed');
          
          // Add environment variable
          console.log('Adding GEMINI_API_KEY to Vercel...');
          execSync(`vercel env add GEMINI_API_KEY production`, { 
            stdio: 'inherit',
            input: apiKey + '\n'
          });
          
          console.log('✅ Environment variable added successfully!');
          console.log('🔄 Redeploying your application...');
          
          try {
            execSync('vercel --prod', { stdio: 'inherit' });
            console.log('✅ Application redeployed successfully!');
          } catch (deployError) {
            console.log('⚠️  Manual redeployment required. Please run: vercel --prod');
          }
          
        } catch (error) {
          console.log('❌ Vercel CLI not found or error occurred');
          console.log('Please install Vercel CLI: npm i -g vercel');
          console.log('Then run: vercel env add GEMINI_API_KEY production');
        }
      }
    }
    
    console.log('\n🎉 Setup complete! Your AI agents should now work properly.');
    console.log('\n📚 Next steps:');
    console.log('1. Create a new agent in the app');
    console.log('2. Configure the agent settings');
    console.log('3. Deploy to Vercel');
    console.log('4. Test your live AI agent!');
    
    console.log('\n🔧 Troubleshooting:');
    console.log('• If your agent shows "API Configuration Error":');
    console.log('  1. Make sure GEMINI_API_KEY is set in Vercel dashboard');
    console.log('  2. Redeploy your application');
    console.log('  3. Check that your API key is valid');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupEnvironment(); 