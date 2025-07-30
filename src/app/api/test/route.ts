import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { agent, testScenario, testType } = await request.json();
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent configuration is required' }, { status: 400 });
    }
    
    if (!testScenario) {
      return NextResponse.json({ error: 'Test scenario is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create test prompt based on test type
    let testPrompt = '';
    
    switch (testType) {
      case 'personality':
        testPrompt = `You are testing the personality of an AI agent. Please respond as the agent would based on its configuration.

AGENT CONFIGURATION:
Name: ${agent.name}
Description: ${agent.description}
Personality: ${agent.personality.tone} ${agent.personality.style} ${agent.personality.expertise} assistant
Creativity: ${agent.personality.creativity}%
Formality: ${agent.personality.formality}%
Response Length: ${agent.personality.responseLength}
Skills: ${agent.capabilities.skills.join(', ')}

VISUAL IDENTITY: ${agent.design.avatar.type} avatar with ${agent.design.theme.primaryColor} primary color theme
BRANDING: ${agent.design.branding.companyName ? `Representing ${agent.design.branding.companyName}` : 'Independent AI assistant'}
GREETING: ${agent.design.widget.greeting}

TEST SCENARIO: ${testScenario}

Please respond as this agent would in this scenario. Be consistent with the agent's personality, capabilities, and visual identity.`;
        break;
        
      case 'capability':
        testPrompt = `You are testing the capabilities of an AI agent. Please respond as the agent would based on its configuration.

AGENT CONFIGURATION:
Name: ${agent.name}
Description: ${agent.description}
Skills: ${agent.capabilities.skills.join(', ')}
Languages: ${agent.capabilities.languages.join(', ')}
Expertise: ${agent.personality.expertise}

VISUAL IDENTITY: ${agent.design.avatar.type} avatar with ${agent.design.theme.primaryColor} primary color theme
BRANDING: ${agent.design.branding.companyName ? `Representing ${agent.design.branding.companyName}` : 'Independent AI assistant'}

TEST SCENARIO: ${testScenario}

Please respond as this agent would in this scenario. Demonstrate the agent's capabilities and skills while maintaining the visual identity and branding.`;
        break;
        
      case 'behavior':
        testPrompt = `You are testing the behavior of an AI agent. Please respond as the agent would based on its configuration.

AGENT CONFIGURATION:
Name: ${agent.name}
Description: ${agent.description}
Conversation Flow: ${agent.behavior.conversationFlow}
Memory: ${agent.behavior.memory ? 'Enabled' : 'Disabled'}
Fallback Behavior: ${agent.behavior.fallbackBehavior}
Personality: ${agent.personality.tone} ${agent.personality.style}

VISUAL IDENTITY: ${agent.design.avatar.type} avatar with ${agent.design.theme.primaryColor} primary color theme
BRANDING: ${agent.design.branding.companyName ? `Representing ${agent.design.branding.companyName}` : 'Independent AI assistant'}
GREETING: ${agent.design.widget.greeting}

TEST SCENARIO: ${testScenario}

Please respond as this agent would in this scenario. Follow the agent's conversation flow and behavior patterns while maintaining the visual identity and branding.`;
        break;
        
      default:
        testPrompt = `You are an AI agent with the following configuration. Please respond to the test scenario as this agent would.

AGENT CONFIGURATION:
Name: ${agent.name}
Description: ${agent.description}
Personality: ${agent.personality.tone} ${agent.personality.style} ${agent.personality.expertise} assistant
Skills: ${agent.capabilities.skills.join(', ')}

VISUAL IDENTITY: ${agent.design.avatar.type} avatar with ${agent.design.theme.primaryColor} primary color theme
BRANDING: ${agent.design.branding.companyName ? `Representing ${agent.design.branding.companyName}` : 'Independent AI assistant'}
GREETING: ${agent.design.widget.greeting}

TEST SCENARIO: ${testScenario}

Please respond as this agent would in this scenario, maintaining the visual identity and branding.`;
    }

    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const aiResponse = response.text().trim();

    // Analyze the response for testing metrics
    const analysisPrompt = `Analyze this AI agent response for the following metrics:

RESPONSE: ${aiResponse}
TEST SCENARIO: ${testScenario}
AGENT TYPE: ${testType}

AGENT DESIGN CONTEXT:
- Avatar Type: ${agent.design.avatar.type}
- Primary Color: ${agent.design.theme.primaryColor}
- Branding: ${agent.design.branding.companyName ? `Representing ${agent.design.branding.companyName}` : 'Independent'}
- Greeting Style: ${agent.design.widget.greeting}

Please provide a JSON response with the following metrics:
{
  "relevance": number (0-100),
  "accuracy": number (0-100),
  "personality_match": number (0-100),
  "helpfulness": number (0-100),
  "design_consistency": number (0-100),
  "overall_score": number (0-100),
  "feedback": string
}

Rate each metric based on how well the response matches the agent's configuration, design identity, and handles the test scenario. Consider both functional performance and design consistency.`;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisResponse = await analysisResult.response;
    const analysisText = analysisResponse.text().trim();

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (error) {
      analysis = {
        relevance: 75,
        accuracy: 75,
        personality_match: 75,
        helpfulness: 75,
        design_consistency: 75,
        overall_score: 75,
        feedback: "Analysis could not be parsed automatically."
      };
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      analysis,
      testType,
      scenario: testScenario
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      error: 'Failed to run test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 