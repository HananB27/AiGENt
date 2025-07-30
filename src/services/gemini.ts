import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI!: GoogleGenerativeAI;
  private model: any;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 4000; // 4 seconds between requests (15 per minute = 4 seconds each)

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment variables');
      // Don't throw error, allow for fallback behavior
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  private async rateLimitDelay() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      const delay = this.RATE_LIMIT_DELAY - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${delay}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  async generateResponse(prompt: string, context?: string): Promise<string> {
    try {
      if (!this.model) {
        throw new Error('Gemini API not initialized - check API key');
      }

      await this.rateLimitDelay();
      
      const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Check if it's a rate limit error
      if ((error as any).toString().includes('429') || (error as any).toString().includes('Too Many Requests')) {
        console.log('Rate limit hit, waiting 60 seconds before retry...');
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds
        return this.generateResponse(prompt, context); // Retry once
      }
      
      // Check if it's a 503 service unavailable error (model overloaded)
      if ((error as any).toString().includes('503') || (error as any).toString().includes('Service Unavailable')) {
        console.log('Gemini model is overloaded, using fallback response');
        throw new Error('Model overloaded - using fallback response');
      }
      
      throw new Error(`Failed to generate response: ${error}`);
    }
  }

  async generateStructuredResponse<T>(prompt: string, context?: string): Promise<T> {
    try {
      if (!this.model) {
        throw new Error('Gemini API not initialized - check API key');
      }

      await this.rateLimitDelay();
      
      const structuredPrompt = `
        ${context || ''}
        
        ${prompt}
        
        IMPORTANT: Respond with ONLY valid JSON. Do not include any other text, explanations, or formatting. The response must be parseable JSON.
      `;

      const result = await this.model.generateContent(structuredPrompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('Failed to parse extracted JSON:', parseError);
        }
      }
      
      // If no JSON found or parsing failed, try to parse the entire response
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse full response as JSON:', parseError);
        console.error('Raw response:', text);
        
        // Return a fallback structured response
        return {
          error: 'Failed to parse AI response as JSON',
          rawResponse: text,
          fallback: true
        } as T;
      }
    } catch (error) {
      console.error('Failed to generate structured response:', error);
      
      // Check if it's a rate limit error
      if ((error as any).toString().includes('429') || (error as any).toString().includes('Too Many Requests')) {
        console.log('Rate limit hit in structured response, waiting 60 seconds before retry...');
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds
        return this.generateStructuredResponse(prompt, context); // Retry once
      }
      
      // Return a fallback response instead of throwing
      return {
        error: `Failed to generate structured response: ${error}`,
        fallback: true
      } as T;
    }
  }

  async generateAgentPrompt(requirements: string, agentType: string): Promise<string> {
    const prompt = `
      Create a detailed AI agent prompt for a ${agentType} agent based on these requirements:
      ${requirements}
      
      The prompt should include:
      1. Clear role definition
      2. Specific capabilities and limitations
      3. Input/output expectations
      4. Error handling guidelines
      5. Performance expectations
      6. Integration requirements
      7. Design and user experience considerations
      8. Visual presentation guidelines
      
      For design considerations, include:
      - Appropriate avatar and visual identity
      - Color scheme and theme recommendations
      - Chat interface styling preferences
      - User interaction patterns
      - Accessibility considerations
      
      Make it comprehensive and actionable, including both functional and design aspects.
    `;

    return this.generateResponse(prompt);
  }

  async testAgentCapabilities(agentPrompt: string, testScenario: string): Promise<any> {
    const prompt = `
      Test this AI agent with the following scenario:
      
      Agent Prompt: ${agentPrompt}
      
      Test Scenario: ${testScenario}
      
      Evaluate the agent's performance and provide:
      1. Functionality score (0-100)
      2. Accuracy assessment
      3. Response quality
      4. Areas for improvement
      5. Overall recommendation
      
      Respond in JSON format.
    `;

    return this.generateStructuredResponse(prompt);
  }

  async optimizeAgentPrompt(currentPrompt: string, feedback: string): Promise<string> {
    const prompt = `
      Optimize this AI agent prompt based on the feedback:
      
      Current Prompt: ${currentPrompt}
      
      Feedback: ${feedback}
      
      Provide an improved version that addresses the feedback while maintaining the core functionality.
    `;

    return this.generateResponse(prompt);
  }

  async validateAgentRequirements(requirements: string, constraints: string[]): Promise<any> {
    const prompt = `
      Validate these agent requirements against the given constraints:
      
      Requirements: ${requirements}
      Constraints: ${constraints.join(', ')}
      
      Provide:
      1. Feasibility assessment
      2. Potential conflicts
      3. Recommendations
      4. Risk assessment
      5. Alternative approaches
      
      Respond in JSON format.
    `;

    return this.generateStructuredResponse(prompt);
  }

  async generateAgentDocumentation(agentSpec: any): Promise<string> {
    const prompt = `
      Generate comprehensive documentation for this AI agent:
      
      ${JSON.stringify(agentSpec, null, 2)}
      
      Include:
      1. Overview and purpose
      2. Capabilities and limitations
      3. Usage instructions
      4. Input/output specifications
      5. Error handling
      6. Performance characteristics
      7. Integration guidelines
      8. Troubleshooting guide
    `;

    return this.generateResponse(prompt);
  }

  async analyzeAgentPerformance(agentId: string, testResults: any[]): Promise<any> {
    const prompt = `
      Analyze the performance of agent ${agentId} based on these test results:
      
      ${JSON.stringify(testResults, null, 2)}
      
      Provide:
      1. Overall performance score
      2. Strengths and weaknesses
      3. Optimization recommendations
      4. Deployment readiness assessment
      5. Monitoring suggestions
      
      Respond in JSON format.
    `;

    return this.generateStructuredResponse(prompt);
  }

  async generateIntegrationPlan(agents: any[]): Promise<any> {
    const prompt = `
      Create an integration plan for these AI agents:
      
      ${JSON.stringify(agents, null, 2)}
      
      Include:
      1. Integration architecture
      2. Communication protocols
      3. Data flow design
      4. Error handling strategy
      5. Performance monitoring
      6. Deployment sequence
      7. Testing strategy
      
      Respond in JSON format.
    `;

    return this.generateStructuredResponse(prompt);
  }
} 