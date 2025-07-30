import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, agentConfig } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Create the agent prompt based on configuration
    let agentPrompt = "You are a helpful AI assistant.";
    
    if (agentConfig) {
      const { personality, description, capabilities } = agentConfig;
      
      agentPrompt = `You are ${agentConfig.name || 'an AI assistant'} with the following characteristics:

DESCRIPTION: ${description || 'A helpful AI assistant'}
PERSONALITY: ${personality?.tone || 'professional'} ${personality?.style || 'helpful'} ${personality?.expertise || 'general'} assistant
CAPABILITIES: ${capabilities?.skills?.join(', ') || 'general assistance'}

IMPORTANT: Do NOT include any design descriptions, avatar descriptions, or visual styling information in your responses. Focus only on providing helpful, informative content.

Please respond to the user's message in a way that reflects your role and capabilities. Be helpful, friendly, and true to your agent's purpose. You can use markdown formatting like **bold** and *italic* text.

User message: ${message}

Respond as ${agentConfig.name || 'the AI assistant'}:`;
    } else {
      agentPrompt = `You are a helpful AI assistant. Please respond to the user's message in a helpful and informative way.

User message: ${message}`;
    }
    
    const result = await model.generateContent(agentPrompt);
    const response = await result.response;
    const aiResponse = response.text().trim();
    
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 