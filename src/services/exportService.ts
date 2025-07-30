import { VercelService } from './vercelService';
import { AgentConfig } from '../app/page';


export interface ExportedAgent {
  name: string;
  description: string;
  files: Array<{
    name: string;
    content: string;
  }>;
  dependencies: Record<string, string>;
  environment: Record<string, string>;
  deploymentUrl?: string;
  deploymentStatus?: string;
  deploymentMessage?: string;
}

export interface ExportConfig {
  format: 'nextjs' | 'react' | 'nodejs' | 'python' | 'html';
  platform: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'local';
  features: string[];
  includeApi: boolean;
  includeDatabase: boolean;
  includeAuth: boolean;
}

export class ExportService {
  private vercelService: VercelService;

  constructor() {
    this.vercelService = new VercelService();
  }

  async exportAgent(agent: AgentConfig, exportConfig: ExportConfig): Promise<ExportedAgent> {
    try {
      const exportedAgent = this.generateAgentCode(agent, exportConfig);
      
          // If deploying to Vercel, attempt automatic deployment
    if (exportConfig.platform === 'vercel') {
      try {
        const deploymentResult = await this.vercelService.deployToVercel(exportedAgent);
        exportedAgent.deploymentUrl = deploymentResult.url;
        exportedAgent.deploymentStatus = 'success';
        exportedAgent.deploymentMessage = `🚀 **Your ${agent.name} is now LIVE on Vercel!**

🔗 **Live URL:** ${deploymentResult.url} 

✅ **What's Ready:**
• Chat interface with your AI agent
• Custom personality and capabilities
• API endpoints for integration
• Responsive design for all devices
• Real-time AI responses

⚠️ **Important Setup Required:**
• Add your Google Gemini API key to Vercel environment variables
• Go to Vercel Dashboard → Settings → Environment Variables
• Add: \`GEMINI_API_KEY\` = your API key
• Redeploy to activate AI functionality

🔑 **Get API Key:** https://makersuite.google.com/app/apikey

🎯 **Test Your Agent:**
Visit the URL above and start chatting with your AI agent!`;
      } catch (error) {
        console.error('Vercel deployment failed:', error);
        exportedAgent.deploymentStatus = 'failed';
        exportedAgent.deploymentMessage = '❌ Deployment preparation failed. Please try again.';
      }
    }
      
      return exportedAgent;
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error(`Failed to export agent: ${error}`);
    }
  }

  private generateAgentCode(agent: AgentConfig, config: ExportConfig): ExportedAgent {
    const files: Array<{ name: string; content: string }> = [];
    
    // Generate package.json
    files.push({
      name: 'package.json',
      content: this.generatePackageJson(agent, config)
    });

    // Generate main application file
    if (config.format === 'nextjs') {
      files.push({
        name: 'app/page.tsx',
        content: this.generateNextJsApp(agent, config)
      });
      
      files.push({
        name: 'app/api/chat/route.ts',
        content: this.generateNextJsApi(agent, config)
      });
      
      files.push({
        name: 'app/globals.css',
        content: this.generateGlobalCSS(agent, config)
      });
      
      files.push({
        name: 'app/layout.tsx',
        content: this.generateAppWrapper(agent, config)
      });
      
      files.push({
        name: 'public/favicon.ico',
        content: this.generateFavicon()
      });
    } else if (config.format === 'react') {
      files.push({
        name: 'src/App.tsx',
        content: this.generateReactApp(agent, config)
      });
    }

    // Generate README
    files.push({
      name: 'README.md',
      content: this.generateReadme(agent, config)
    });

    // Generate environment variables
    if (config.includeApi) {
      files.push({
        name: '.env.example',
        content: this.generateEnvExample(agent, config)
      });
    }

    return {
      name: agent.name,
      description: agent.description,
      files,
      dependencies: this.getDependencies(config),
      environment: this.getEnvironmentVariables(agent, config)
    };
  }

  private generatePackageJson(agent: AgentConfig, config: ExportConfig): string {
    const dependencies = this.getDependencies(config);
    
    // Sanitize the name for Vercel (no special characters except letters, digits, dots, underscores, hyphens)
    const sanitizedName = agent.name.toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return JSON.stringify({
      name: sanitizedName,
      version: '1.0.0',
      description: agent.description,
      main: config.format === 'nextjs' ? 'app/page.tsx' : 'src/App.tsx',
      scripts: {
        dev: config.format === 'nextjs' ? 'next dev' : 'react-scripts start',
        build: config.format === 'nextjs' ? 'next build' : 'react-scripts build',
        start: config.format === 'nextjs' ? 'next start' : 'react-scripts start'
      },
      dependencies,
      devDependencies: {
        typescript: '^4.9.0',
        '@types/node': '^18.0.0',
        '@types/react': '^18.0.0'
      }
    }, null, 2);
  }

  private generateNextJsApp(agent: AgentConfig, config: ExportConfig): string {
    return `
'use client';

import React, { useState } from 'react';

export default function ${agent.name.replace(/[^a-zA-Z0-9]/g, '')}App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Design configuration from agent
  const design = ${JSON.stringify(agent.design, null, 2)};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          agentConfig: {
            name: ${JSON.stringify(agent.name)},
            description: ${JSON.stringify(agent.description)},
            personality: ${JSON.stringify(agent.personality)},
            capabilities: ${JSON.stringify(agent.capabilities)},
            design: design
          }
        })
      });
      
      console.log('API Response status:', res.status);
      console.log('API Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = '❌ **Service Error**\\n\\n';
        
        if (res.status === 400) {
          errorMessage += 'Invalid request. Please check your message and try again.';
        } else if (res.status === 405) {
          errorMessage += 'Method not allowed. Please try again.';
        } else if (res.status === 500) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage += errorData.error || 'Internal server error. Please try again later.';
            if (errorData.details) {
              errorMessage += '\\n\\nDetails: ' + errorData.details;
            }
          } catch {
            errorMessage += 'Internal server error. Please try again later.';
          }
        } else {
          errorMessage += 'An unexpected error occurred. Please try again.';
        }
        
        setResponse(errorMessage);
        return;
      }
      
      const data = await res.json();
      console.log('API Response data:', data);
      
      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse('❌ **Unexpected Response**\\n\\nThe AI service returned an unexpected response format.');
      }
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle different types of errors
      if (error.message?.includes('Failed to fetch')) {
        setResponse('❌ **Connection Error**\\n\\nUnable to connect to the AI service. Please check your internet connection and try again.');
      } else if (error.message?.includes('Unexpected end of JSON input')) {
        setResponse('❌ **Service Temporarily Unavailable**\\n\\nThe AI service is temporarily unavailable. Please try again in a few moments.');
      } else if (error.message?.includes('API key not configured')) {
        setResponse('❌ **Service Error**\\n\\nThe AI service encountered an error. Please try again later.');
      } else {
        setResponse('❌ **Error**\\n\\n' + (error.message || 'An unexpected error occurred. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const getAvatarContent = () => {
    switch (design.avatar.type) {
      case 'emoji':
        return design.avatar.value;
      case 'initials':
        return ${JSON.stringify(agent.name)}.substring(0, 2).toUpperCase();
      case 'icon':
      default:
        return '🤖';
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: design.theme.backgroundColor,
      color: design.theme.textColor,
      fontFamily: design.chatInterface.fontFamily,
      minHeight: '100vh'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: design.theme.primaryColor,
        color: design.theme.backgroundColor,
        borderRadius: design.theme.borderRadius + 'px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px'
        }}>
                     <div style={{
             width: '50px',
             height: '50px',
             borderRadius: '50%',
             backgroundColor: design.avatar.backgroundColor,
             color: design.avatar.textColor,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             fontSize: '24px',
             fontWeight: 'bold',
             border: '2px solid ' + design.theme.primaryColor
           }}>
             {getAvatarContent()}
           </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '32px', 
              fontWeight: '700',
              fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '-0.5px'
            }}>${agent.name}</h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              opacity: 0.9,
              fontSize: '16px',
              fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
              fontWeight: '500'
            }}>{design.branding.tagline || 'AI Assistant'}</p>
          </div>
        </div>

      </div>
      
      <div style={{
        backgroundColor: design.chatInterface.agentBubbleColor,
        borderRadius: design.theme.borderRadius + 'px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid ' + design.theme.secondaryColor,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: design.avatar.backgroundColor,
            color: design.avatar.textColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            flexShrink: 0,
            border: '1px solid ' + design.theme.primaryColor
          }}>
            {getAvatarContent()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              margin: 0, 
              fontSize: '16px',
              color: design.theme.textColor,
              lineHeight: 1.5
            }} dangerouslySetInnerHTML={{ __html: design.widget.greeting.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\\*(.*?)\\*/g, '<em>$1</em>').replace(/\\n/g, '<br/>') }} />
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={design.widget.placeholder}
          style={{ 
            width: '100%', 
            height: '100px', 
            marginBottom: '10px',
            padding: '12px',
            borderRadius: design.theme.borderRadius + 'px',
            border: '2px solid ' + design.theme.primaryColor,
            backgroundColor: '#f3f3f5',
            color: design.theme.textColor,
            fontFamily: design.chatInterface.fontFamily,
            fontSize: design.chatInterface.fontSize === 'small' ? '14px' : design.chatInterface.fontSize === 'large' ? '18px' : '16px',
            resize: 'vertical'
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            backgroundColor: design.theme.primaryColor,
            color: design.theme.backgroundColor,
            border: 'none',
            padding: '12px 24px',
            borderRadius: design.theme.borderRadius + 'px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transform: loading ? 'none' : 'translateY(0)'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }
          }}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
      
      {response && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px',
          backgroundColor: design.chatInterface.agentBubbleColor,
          borderRadius: design.theme.borderRadius + 'px',
          border: '1px solid ' + design.theme.secondaryColor,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
                         <div style={{
               width: '40px',
               height: '40px',
               borderRadius: '50%',
               backgroundColor: design.avatar.backgroundColor,
               color: design.avatar.textColor,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: '18px',
               fontWeight: 'bold',
               flexShrink: 0,
               border: '1px solid ' + design.theme.primaryColor
             }}>
               {getAvatarContent()}
             </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                color: design.theme.textColor,
                fontSize: '16px'
              }}>${agent.name}</h3>
              <div style={{ 
                margin: 0, 
                color: design.theme.textColor,
                fontSize: design.chatInterface.fontSize === 'small' ? '14px' : design.chatInterface.fontSize === 'large' ? '18px' : '16px',
                lineHeight: 1.5
              }} dangerouslySetInnerHTML={{ __html: response.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\\*(.*?)\\*/g, '<em>$1</em>').replace(/\\n/g, '<br/>') }} />
            </div>
          </div>
        </div>
      )}
      
      {design.widget.showCompanyBranding && design.branding.companyName && (
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '15px',
          backgroundColor: design.theme.secondaryColor,
          borderRadius: design.theme.borderRadius + 'px',
          borderTop: '2px solid ' + design.theme.primaryColor
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px',
            color: design.theme.textColor,
            opacity: 0.8
          }}>
            Powered by {design.branding.companyName}
          </p>
        </div>
      )}
    </div>
  );
}
    `.trim();
  }

  private generateNextJsApi(agent: AgentConfig, config: ExportConfig): string {
    return `
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    console.log('API route called');
    
    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' }, 
        { status: 405, headers }
      );
    }

    let body;
    try {
      body = await request.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' }, 
        { status: 400, headers }
      );
    }
    
    const { message, agentConfig } = body;
    
    if (!message || typeof message !== 'string') {
      console.log('No valid message provided');
      return NextResponse.json(
        { error: 'Message is required and must be a string' }, 
        { status: 400, headers }
      );
    }

    console.log('Processing message:', message);

    // Secure API key handling - no keys exposed in generated code
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API key configured:', apiKey ? 'Yes' : 'No');
    console.log('API key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      console.error('No API key available');
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to your Vercel environment variables.' }, 
        { status: 500, headers }
      );
    }

    let genAI;
    try {
      console.log('Initializing GoogleGenerativeAI...');
      genAI = new GoogleGenerativeAI(apiKey);
      console.log('GoogleGenerativeAI initialized successfully');
    } catch (genAIError) {
      console.error('Failed to initialize GoogleGenerativeAI:', genAIError);
      console.error('GenAI Error details:', {
        message: genAIError.message,
        name: genAIError.name,
        stack: genAIError.stack
      });
      return NextResponse.json(
        { error: 'Failed to initialize AI service' }, 
        { status: 500, headers }
      );
    }

    let model;
    try {
      console.log('Getting generative model...');
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      console.log('Model initialized successfully with gemini-1.5-pro');
    } catch (modelError) {
      console.error('Failed to get generative model:', modelError);
      console.error('Model Error details:', {
        message: modelError.message,
        name: modelError.name,
        stack: modelError.stack
      });
      // Try fallback model
      try {
        console.log('Trying fallback model: gemini-pro');
        model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        console.log('Using fallback model: gemini-pro');
      } catch (fallbackError) {
        console.error('Failed to get fallback model:', fallbackError);
        console.error('Fallback Error details:', {
          message: fallbackError.message,
          name: fallbackError.name,
          stack: fallbackError.stack
        });
        return NextResponse.json(
          { error: 'Failed to load AI model' }, 
          { status: 500, headers }
        );
      }
    }
    
    // Create the agent prompt based on configuration
    let agentPrompt = "You are a helpful AI assistant.";
    
    try {
      if (agentConfig) {
        const { personality, description, capabilities } = agentConfig;
        
        agentPrompt = \`You are \${agentConfig.name || 'an AI assistant'} with the following characteristics:

DESCRIPTION: \${description || 'A helpful AI assistant'}
PERSONALITY: \${personality?.tone || 'professional'} \${personality?.style || 'helpful'} \${personality?.expertise || 'general'} assistant
CAPABILITIES: \${capabilities?.skills?.join(', ') || 'general assistance'}

IMPORTANT: Do NOT include any design descriptions, avatar descriptions, or visual styling information in your responses. Focus only on providing helpful, informative content.

Please respond to the user's message in a way that reflects your role and capabilities. Be helpful, friendly, and true to your agent's purpose. You can use markdown formatting like **bold** and *italic* text.

User message: \${message}

Respond as \${agentConfig.name || 'the AI assistant'}:\`;
      } else {
        agentPrompt = \`You are a helpful AI assistant. Please respond to the user's message in a helpful and informative way.

User message: \${message}\`;
      }
    } catch (promptError) {
      console.error('Failed to generate prompt:', promptError);
      agentPrompt = \`You are a helpful AI assistant. Please respond to the user's message in a helpful and informative way.

User message: \${message}\`;
    }
    
    console.log('Generated prompt:', agentPrompt);
    
    // Real Google AI integration
    let aiResponse;
    try {
      console.log('Attempting to call Google Generative AI...');
      console.log('Prompt length:', agentPrompt.length);
      console.log('Prompt preview:', agentPrompt.substring(0, 200) + '...');
      
      const result = await model.generateContent(agentPrompt);
      console.log('generateContent call successful, getting response...');
      
      const response = await result.response;
      console.log('Response received, extracting text...');
      
      aiResponse = response.text().trim();
      console.log('Text extracted successfully');
      console.log('Response length:', aiResponse.length);
      console.log('Response preview:', aiResponse.substring(0, 200) + '...');
      
      console.log('Google AI response received successfully');
    } catch (aiError) {
      console.error('Google AI call failed:', aiError);
      console.error('AI Error details:', {
        message: aiError.message,
        name: aiError.name,
        stack: aiError.stack,
        cause: aiError.cause
      });
      
      // Fallback to test response if AI fails
      aiResponse = \`Hello! I'm \${agentConfig?.name || 'your AI assistant'}. I received your message: "\${message}"

I'm currently experiencing issues with the AI service. Here's what I received: \${message}

Error details: \${aiError.message}

To fix this:
1. Go to your Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add GEMINI_API_KEY with your Google Gemini API key
4. Redeploy your application

I'm here to help! The AI service will be restored once the API key is configured.\`;
      
      console.log('Using fallback response due to AI error');
    }
    
    console.log('AI response generated successfully');
    
    return NextResponse.json({ response: aiResponse }, { headers });
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    if (error.message?.includes('API key')) {
      return NextResponse.json({ 
        error: 'Invalid API key. Please check your GEMINI_API_KEY configuration.',
        details: error.message
      }, { status: 500, headers });
    }
    
    if (error.message?.includes('quota')) {
      return NextResponse.json({ 
        error: 'API quota exceeded. Please check your Gemini API usage limits.',
        details: error.message
      }, { status: 500, headers });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error. Please try again later.',
      details: error.message || 'Unknown error occurred'
    }, { status: 500, headers });
  }
}
    `.trim();
  }

  private generateGlobalCSS(agent: AgentConfig, config: ExportConfig): string {
    return `
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: ${agent.design.chatInterface.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  color: ${agent.design.theme.textColor};
  background: ${agent.design.theme.backgroundColor};
}

a {
  color: inherit;
  text-decoration: none;
}

textarea {
  font-family: inherit;
}

button {
  font-family: inherit;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}
    `.trim();
  }

  private generateAppWrapper(agent: AgentConfig, config: ExportConfig): string {
    return `
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: ${JSON.stringify(agent.name)},
  description: ${JSON.stringify(agent.description)},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
    `.trim();
  }

  private generateFavicon(): string {
    // Return a simple base64 encoded favicon (1x1 pixel transparent PNG)
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  private generateReactApp(agent: AgentConfig, config: ExportConfig): string {
    return `
import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, you would call your backend API here
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResponse('This is a simulated response from ${agent.name}. In a real deployment, this would connect to your AI backend.');
    } catch (error) {
      setResponse('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>${agent.name}</h1>
        <p>${agent.description}</p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="chat-input"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>
        
        {response && (
          <div className="response">
            <h3>Response:</h3>
            <p>{response}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
    `.trim();
  }

  private generateReadme(agent: AgentConfig, config: ExportConfig): string {
    return `
# ${agent.name}

${agent.description}

## Features

- ${agent.capabilities.skills.join('\n- ')}

## Setup

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Set up environment variables (see .env.example)
4. Run the development server: \`npm run dev\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is configured for deployment on ${config.platform}.

### Environment Variables

Make sure to set the following environment variables:
- \`GEMINI_API_KEY\`: Your Google Gemini API key

## Technologies Used

- ${config.format === 'nextjs' ? 'Next.js' : 'React'}
- TypeScript
- Google Gemini AI
- ${config.includeApi ? 'API Routes' : ''}
- ${config.includeDatabase ? 'Database Integration' : ''}
- ${config.includeAuth ? 'Authentication' : ''}

## License

MIT
    `.trim();
  }

  private generateEnvExample(agent: AgentConfig, config: ExportConfig): string {
    return `
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Database URL (if using database)
# DATABASE_URL=your_database_url_here

# Optional: Authentication (if using auth)
# AUTH_SECRET=your_auth_secret_here
    `.trim();
  }

  private getDependencies(config: ExportConfig): Record<string, string> {
    const baseDeps = {
      react: '^18.0.0',
      'react-dom': '^18.0.0'
    };

    if (config.format === 'nextjs') {
      return {
        ...baseDeps,
        next: '^13.0.0',
        '@google/generative-ai': '^0.2.0'
      };
    } else if (config.format === 'react') {
      return {
        ...baseDeps,
        'react-scripts': '^5.0.0',
        '@google/generative-ai': '^0.2.0'
      };
    }

    return baseDeps;
  }

  private getEnvironmentVariables(agent: AgentConfig, config: ExportConfig): Record<string, string> {
    const env: Record<string, string> = {};

    if (config.includeApi) {
      env.GEMINI_API_KEY = 'your_gemini_api_key_here';
    }

    if (config.includeDatabase) {
      env.DATABASE_URL = 'your_database_url_here';
    }

    if (config.includeAuth) {
      env.AUTH_SECRET = 'your_auth_secret_here';
    }

    return env;
  }

  async downloadExport(exportedAgent: ExportedAgent): Promise<Blob> {
    // Create a zip file with all the exported files
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    exportedAgent.files.forEach((file: { name: string; content: string }) => {
      zip.file(file.name, file.content);
    });

    // Add deployment instructions
    zip.file('DEPLOYMENT.md', `# Deployment Instructions for ${exportedAgent.name}

## Quick Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/${exportedAgent.name.toLowerCase().replace(/\s+/g, '-')}.git
   git push -u origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: \`GEMINI_API_KEY\` = your API key
   - Deploy!

## Manual Deployment

1. Install dependencies: \`npm install\`
2. Add your \`GEMINI_API_KEY\` to \`.env.local\`
3. Run: \`npm run dev\` for development
4. Run: \`npm run build && npm start\` for production

## Environment Variables

Create a \`.env.local\` file:
\`\`\`
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

Get your API key from: https://makersuite.google.com/app/apikey
`);

    return await zip.generateAsync({ type: 'blob' });
  }

  getExportFormats(): { value: string; label: string; description: string }[] {
    return [
      { value: 'nextjs', label: 'Next.js', description: 'Full-stack React framework with API routes' },
      { value: 'react', label: 'React', description: 'Frontend React application' },
      { value: 'nodejs', label: 'Node.js', description: 'Backend API server' },
      { value: 'python', label: 'Python', description: 'Python Flask/FastAPI application' },
      { value: 'html', label: 'HTML', description: 'Static HTML with JavaScript' }
    ];
  }

  getDeploymentPlatforms(): { value: string; label: string; description: string }[] {
    return [
      { value: 'vercel', label: 'Vercel', description: 'Deploy to Vercel (recommended)' },
      { value: 'netlify', label: 'Netlify', description: 'Deploy to Netlify' },
      { value: 'aws', label: 'AWS', description: 'Deploy to Amazon Web Services' },
      { value: 'gcp', label: 'Google Cloud', description: 'Deploy to Google Cloud Platform' },
      { value: 'local', label: 'Local', description: 'Run locally' }
    ];
  }
} 