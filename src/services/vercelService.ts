import { AgentConfig } from '../types/agent';

export interface ExportedAgent {
  name: string;
  description: string;
  files: Array<{
    name: string;
    content: string;
  }>;
  dependencies: Record<string, string>;
  environment: Record<string, string>;
}

export class VercelService {
  private token: string;

  constructor() {
    this.token = process.env.NEXT_PUBLIC_VERCEL_TOKEN || process.env.VERCEL_TOKEN || '';
    if (!this.token) {
      console.warn('VERCEL_TOKEN environment variable is not set - Vercel deployments will not work');
    }
  }

  async deployAgent(agentConfig: AgentConfig): Promise<{ url: string; deploymentId: string }> {
    try {
      if (!this.token) {
        throw new Error('VERCEL_TOKEN is required for Vercel deployments');
      }

      if (!agentConfig.generatedCode) {
        throw new Error('No generated code found in agent configuration');
      }

      // Sanitize the name for Vercel
      const sanitizedName = agentConfig.name.toLowerCase()
        .replace(/[^a-z0-9._-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const projectName = `${sanitizedName}-${Date.now()}`;
      
      // Create a temporary directory for the project
      const fs = require('fs');
      const path = require('path');
      const { execSync } = require('child_process');
      const os = require('os');
      
      const tempDir = path.join(os.tmpdir(), projectName);
      
      // Create the project directory
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Write all generated code files to the temporary directory
      for (const [filePath, content] of Object.entries(agentConfig.generatedCode)) {
        const fullPath = path.join(tempDir, filePath);
        const dir = path.dirname(fullPath);
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, content as string);
      }
      
      // Create vercel.json configuration
      const vercelConfig = {
        version: 2,
        builds: [
          {
            src: "package.json",
            use: "@vercel/next"
          }
        ],
        env: {
          GEMINI_API_KEY: process.env.GEMINI_API_KEY || ""
        }
      };
      
      fs.writeFileSync(path.join(tempDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
      
      // Deploy using Vercel CLI
      console.log('Deploying agent to Vercel...');
      
      // Set Vercel token as environment variable
      process.env.VERCEL_TOKEN = this.token;
      
      // Run vercel deploy command
      const deployCommand = `cd "${tempDir}" && vercel --prod --yes --token ${this.token}`;
      
      try {
        const output = execSync(deployCommand, { 
          encoding: 'utf8',
          timeout: 120000 // 2 minutes timeout
        });
        
        console.log('Vercel CLI output:', output);
        
        // Extract deployment URL from output
        const urlMatch = output.match(/Production: (https:\/\/[^\s]+\.vercel\.app)/);
        const deploymentIdMatch = output.match(/Inspect: https:\/\/vercel\.com\/[^\/]+\/[^\/]+\/([^\s]+)/);
        
        if (urlMatch) {
          const url = urlMatch[1];
          const deploymentId = deploymentIdMatch ? deploymentIdMatch[1] : `dpl_${Date.now()}`;
          
          console.log(`Agent deployment successful: ${url}`);
          
          // Clean up temporary directory
          fs.rmSync(tempDir, { recursive: true, force: true });
          
          return {
            url,
            deploymentId
          };
        } else {
          // Fallback: try to find any vercel.app URL
          const fallbackUrlMatch = output.match(/https:\/\/[^\s]+\.vercel\.app/);
          if (fallbackUrlMatch) {
            const url = fallbackUrlMatch[0];
            console.log(`Agent deployment successful (fallback): ${url}`);
            
            // Clean up temporary directory
            fs.rmSync(tempDir, { recursive: true, force: true });
            
            return {
              url,
              deploymentId: `dpl_${Date.now()}`
            };
          }
          
          throw new Error('Could not extract deployment URL from Vercel output');
        }
        
      } catch (execError: any) {
        console.error('Vercel CLI error:', execError.message);
        
        // Fallback: try to extract URL from error output
        const errorOutput = execError.stdout || execError.stderr || '';
        const urlMatch = errorOutput.match(/https:\/\/[^\s]+\.vercel\.app/);
        
        if (urlMatch) {
          console.log(`Agent deployment URL found in output: ${urlMatch[0]}`);
          return {
            url: urlMatch[0],
            deploymentId: `dpl_${Date.now()}`
          };
        }
        
        throw new Error(`Vercel deployment failed: ${execError.message}`);
      }
      
    } catch (error) {
      console.error('Agent deployment error:', error);
      throw new Error(`Failed to deploy agent to Vercel: ${error}`);
    }
  }

  async deployToVercel(exportedAgent: ExportedAgent): Promise<{ url: string; deploymentId: string }> {
    try {
      if (!this.token) {
        throw new Error('VERCEL_TOKEN is required for Vercel deployments');
      }

      // Sanitize the name for Vercel (no special characters except letters, digits, dots, underscores, hyphens)
      const sanitizedName = exportedAgent.name.toLowerCase()
        .replace(/[^a-z0-9._-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const projectName = `${sanitizedName}-${Date.now()}`;
      
      // Create a temporary directory for the project
      const fs = require('fs');
      const path = require('path');
      const { execSync } = require('child_process');
      const os = require('os');
      
      const tempDir = path.join(os.tmpdir(), projectName);
      
      // Create the project directory
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Write all files to the temporary directory
      exportedAgent.files.forEach((file: { name: string; content: string }) => {
        const filePath = path.join(tempDir, file.name);
        const dir = path.dirname(filePath);
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, file.content);
      });
      
      // Create vercel.json configuration
      const vercelConfig = {
        version: 2,
        builds: [
          {
            src: "package.json",
            use: "@vercel/next"
          }
        ],
        env: {
          GEMINI_API_KEY: process.env.GEMINI_API_KEY || ""
        }
      };
      
      fs.writeFileSync(path.join(tempDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
      
      // Deploy using Vercel CLI
      console.log('Deploying to Vercel...');
      
      // Set Vercel token as environment variable
      process.env.VERCEL_TOKEN = this.token;
      
      // Run vercel deploy command
      const deployCommand = `cd "${tempDir}" && vercel --prod --yes --token ${this.token}`;
      
      try {
        const output = execSync(deployCommand, { 
          encoding: 'utf8',
          timeout: 120000 // 2 minutes timeout
        });
        
        console.log('Vercel CLI output:', output);
        
        // Extract deployment URL from output
        const urlMatch = output.match(/Production: (https:\/\/[^\s]+\.vercel\.app)/);
        const deploymentIdMatch = output.match(/Inspect: https:\/\/vercel\.com\/[^\/]+\/[^\/]+\/([^\s]+)/);
        
        if (urlMatch) {
          const url = urlMatch[1];
          const deploymentId = deploymentIdMatch ? deploymentIdMatch[1] : `dpl_${Date.now()}`;
          
          console.log(`Deployment successful: ${url}`);
          
          // Clean up temporary directory
          fs.rmSync(tempDir, { recursive: true, force: true });
          
          return {
            url,
            deploymentId
          };
        } else {
          // Fallback: try to find any vercel.app URL
          const fallbackUrlMatch = output.match(/https:\/\/[^\s]+\.vercel\.app/);
          if (fallbackUrlMatch) {
            const url = fallbackUrlMatch[0];
            console.log(`Deployment successful (fallback): ${url}`);
            
            // Clean up temporary directory
            fs.rmSync(tempDir, { recursive: true, force: true });
            
            return {
              url,
              deploymentId: `dpl_${Date.now()}`
            };
          }
          
          throw new Error('Could not extract deployment URL from Vercel output');
        }
        
      } catch (execError: any) {
        console.error('Vercel CLI error:', execError.message);
        
        // Fallback: try to extract URL from error output
        const errorOutput = execError.stdout || execError.stderr || '';
        const urlMatch = errorOutput.match(/https:\/\/[^\s]+\.vercel\.app/);
        
        if (urlMatch) {
          console.log(`Deployment URL found in output: ${urlMatch[0]}`);
          return {
            url: urlMatch[0],
            deploymentId: `dpl_${Date.now()}`
          };
        }
        
        throw new Error(`Vercel deployment failed: ${execError.message}`);
      }
      
    } catch (error) {
      console.error('Vercel deployment error:', error);
      throw new Error(`Failed to deploy to Vercel: ${error}`);
    }
  }

  async setEnvironmentVariable(projectId: string, key: string, value: string): Promise<void> {
    try {
      if (!this.token) {
        throw new Error('VERCEL_TOKEN is required for setting environment variables');
      }

      // Set environment variable using Vercel API
      const response = await fetch(`https://api.vercel.com/v1/projects/${projectId}/env`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key,
          value,
          target: ['production', 'preview', 'development']
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to set environment variable: ${response.status} - ${errorData}`);
      }

      console.log(`Successfully set environment variable ${key} for project ${projectId}`);
    } catch (error) {
      console.error('Error setting environment variable:', error);
      throw error;
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<any> {
    try {
      if (!this.token) {
        throw new Error('VERCEL_TOKEN is required for checking deployment status');
      }

      const response = await fetch(`https://api.vercel.com/v1/deployments/${deploymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get deployment status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting deployment status:', error);
      throw error;
    }
  }

  async listProjects(): Promise<any[]> {
    try {
      if (!this.token) {
        throw new Error('VERCEL_TOKEN is required for listing projects');
      }

      const response = await fetch('https://api.vercel.com/v1/projects', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to list projects: ${response.status}`);
      }

      const data = await response.json();
      return data.projects || [];
    } catch (error) {
      console.error('Error listing projects:', error);
      throw error;
    }
  }
} 