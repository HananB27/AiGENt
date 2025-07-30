import { Agent, OrchestratorRequest, Message, AgentCategory, RequestStatus, ProcessingStep } from '../types/agent';

export class OrchestratorAgent {
  private agents: Map<string, Agent> = new Map();
  private requests: Map<string, OrchestratorRequest> = new Map();

  constructor() {
    this.initializeCoreAgents();
  }

  private async initializeCoreAgents() {
    // Initialize the core agents
    const coreAgents = [
      this.createPlannerAgent(),
      this.createAnalyzerAgent(),
      this.createCreatorAgent(),
      this.createTesterAgent(),
      this.createValidatorAgent(),
      this.createOptimizerAgent(),
      this.createDocumenterAgent(),
      this.createDeployerAgent(),
      this.createMonitorAgent(),
      this.createCoordinatorAgent(),
      this.createSecurityAgent(),
      this.createPerformanceAgent(),
      this.createArchitectureAgent()
    ];

    coreAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  async processUserRequest(userRequest: string, userId: string): Promise<OrchestratorRequest> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request: OrchestratorRequest = {
      id: requestId,
      userRequest,
      userId,
      timestamp: new Date(),
      status: RequestStatus.PROCESSING,
      currentStep: ProcessingStep.ANALYZING,
      stepProgress: 0,
      stepDescription: 'Analyzing your request and planning agent generation...',
      generatedAgents: [],
      conversationHistory: [{
        id: `msg_${Date.now()}`,
        role: 'user',
        content: userRequest,
        timestamp: new Date()
      }]
    };

    this.requests.set(requestId, request);

    try {
      // Try to make an API call to check if the server-side API is available
      const apiAvailable = await this.checkApiAvailability();
      
      if (!apiAvailable) {
        // Provide fallback response when API is not available
        request.currentStep = ProcessingStep.COMPLETED;
        request.stepProgress = 100;
        request.stepDescription = 'API not configured - using demo mode';
        request.status = RequestStatus.COMPLETED;
        request.generatedAgents = ['demo-agent-1', 'demo-agent-2'];
        
        // Add demo response to conversation
        request.conversationHistory.push({
          id: `msg_${Date.now()}_demo`,
          role: 'assistant',
          content: this.generateDemoResponse(userRequest),
          timestamp: new Date()
        });
        
        return request;
      }

      // Make API call to the server-side orchestrator
      const response = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRequest,
          userId,
          requestId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API call failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      // Update request with server response
      request.currentStep = ProcessingStep.COMPLETED;
      request.stepProgress = 100;
      request.stepDescription = 'Orchestration completed successfully';
      request.status = RequestStatus.COMPLETED;
      request.generatedAgents = result.generatedAgents || [];
      
      // Store agent configurations for download
      if (result.agentConfigs) {
        request.agentConfigs = result.agentConfigs;
      }
      
      // Add server response to conversation
      request.conversationHistory.push({
        id: `msg_${Date.now()}_server`,
        role: 'assistant',
        content: result.response || 'Orchestration completed successfully',
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Orchestrator error:', error);
      
      // Provide fallback response on error
      request.currentStep = ProcessingStep.COMPLETED;
      request.stepProgress = 100;
      request.stepDescription = 'Completed with fallback response';
      request.status = RequestStatus.COMPLETED;
      request.generatedAgents = ['fallback-agent-1'];
      
      // Add error response to conversation
      request.conversationHistory.push({
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: this.generateErrorResponse(userRequest, error),
        timestamp: new Date()
      });
    }

    return request;
  }

  private async checkApiAvailability(): Promise<boolean> {
    try {
      const response = await fetch('/api/orchestrator/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.log('API not available:', error);
      return false;
    }
  }

  // Core agent creation methods
  private createPlannerAgent(): Agent {
    return {
      id: 'planner',
      name: 'Strategic Planner',
      description: 'Plans the overall agent generation strategy and coordinates the process',
      prompt: 'You are a strategic planner for AI agent generation. Analyze requirements and create comprehensive plans.',
      capabilities: ['planning', 'strategy', 'coordination', 'analysis'],
      category: AgentCategory.PLANNER,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createAnalyzerAgent(): Agent {
    return {
      id: 'analyzer',
      name: 'Requirement Analyzer',
      description: 'Analyzes user requirements and extracts key information for agent generation',
      prompt: 'You are a requirement analyzer. Extract and structure user requirements for AI agent generation.',
      capabilities: ['analysis', 'requirement-extraction', 'structuring', 'classification'],
      category: AgentCategory.ANALYZER,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createCreatorAgent(): Agent {
    return {
      id: 'creator',
      name: 'Agent Creator',
      description: 'Creates new AI agents based on specifications and requirements',
      prompt: 'You are an AI agent creator. Generate detailed agent specifications, prompts, and capabilities.',
      capabilities: ['creation', 'specification', 'prompt-generation', 'capability-definition'],
      category: AgentCategory.CREATOR,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createTesterAgent(): Agent {
    return {
      id: 'tester',
      name: 'Quality Tester',
      description: 'Tests generated agents for functionality, performance, and reliability',
      prompt: 'You are a quality tester for AI agents. Perform comprehensive testing and provide detailed feedback.',
      capabilities: ['testing', 'quality-assurance', 'performance-testing', 'validation'],
      category: AgentCategory.TESTER,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createValidatorAgent(): Agent {
    return {
      id: 'validator',
      name: 'Agent Validator',
      description: 'Validates that generated agents meet quality standards and user requirements',
      prompt: 'You are an agent validator. Ensure agents meet quality standards and user requirements.',
      capabilities: ['validation', 'quality-check', 'standards-compliance', 'requirement-verification'],
      category: AgentCategory.VALIDATOR,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createOptimizerAgent(): Agent {
    return {
      id: 'optimizer',
      name: 'Performance Optimizer',
      description: 'Optimizes agent performance and capabilities based on test results',
      prompt: 'You are a performance optimizer for AI agents. Improve agent capabilities and efficiency.',
      capabilities: ['optimization', 'performance-improvement', 'efficiency', 'enhancement'],
      category: AgentCategory.OPTIMIZER,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createDocumenterAgent(): Agent {
    return {
      id: 'documenter',
      name: 'Documentation Generator',
      description: 'Generates comprehensive documentation for created agents',
      prompt: 'You are a documentation generator for AI agents. Create comprehensive documentation.',
      capabilities: ['documentation', 'technical-writing', 'user-guides', 'api-documentation'],
      category: AgentCategory.DOCUMENTER,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createDeployerAgent(): Agent {
    return {
      id: 'deployer',
      name: 'Agent Deployer',
      description: 'Deploys and integrates agents into the production environment',
      prompt: 'You are an agent deployer. Deploy and integrate agents into production environments.',
      capabilities: ['deployment', 'integration', 'production-setup', 'environment-management'],
      category: AgentCategory.DEPLOYER,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createMonitorAgent(): Agent {
    return {
      id: 'monitor',
      name: 'System Monitor',
      description: 'Monitors agent performance and system health',
      prompt: 'You are a system monitor for AI agents. Monitor performance and system health.',
      capabilities: ['monitoring', 'performance-tracking', 'health-checks', 'alerting'],
      category: AgentCategory.MONITOR,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createCoordinatorAgent(): Agent {
    return {
      id: 'coordinator',
      name: 'Agent Coordinator',
      description: 'Coordinates communication and collaboration between agents',
      prompt: 'You are an agent coordinator. Facilitate communication and collaboration between agents.',
      capabilities: ['coordination', 'communication', 'collaboration', 'workflow-management'],
      category: AgentCategory.COORDINATOR,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createSecurityAgent(): Agent {
    return {
      id: 'security',
      name: 'Security Specialist',
      description: 'Ensures agents meet security requirements and best practices',
      prompt: 'You are a security specialist for AI agents. Ensure security compliance and best practices.',
      capabilities: ['security', 'compliance', 'vulnerability-assessment', 'privacy-protection'],
      category: AgentCategory.VALIDATOR,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createPerformanceAgent(): Agent {
    return {
      id: 'performance',
      name: 'Performance Analyst',
      description: 'Analyzes and optimizes agent performance characteristics',
      prompt: 'You are a performance analyst for AI agents. Analyze and optimize performance characteristics.',
      capabilities: ['performance-analysis', 'optimization', 'benchmarking', 'scalability'],
      category: AgentCategory.OPTIMIZER,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  private createArchitectureAgent(): Agent {
    return {
      id: 'architecture',
      name: 'Architecture Setup Agent',
      description: 'Sets up deployment architecture and Vercel integration',
      prompt: 'You are an architecture setup agent. Design deployment architecture and configure Vercel integration.',
      capabilities: ['architecture-design', 'deployment-configuration', 'vercel-integration', 'infrastructure-setup'],
      category: AgentCategory.DEPLOYER,
      status: 'active' as any,
      createdAt: new Date()
    };
  }

  // Public methods for external access
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getRequest(requestId: string): OrchestratorRequest | undefined {
    return this.requests.get(requestId);
  }

  getAllRequests(): OrchestratorRequest[] {
    return Array.from(this.requests.values());
  }

  private generateDemoResponse(userRequest: string): string {
    return `🎯 **Orchestrator Demo Mode**

I've analyzed your request: "${userRequest}"

**Demo Agents Created:**
1. **Requirement Analyzer** - Extracted key requirements from your request
2. **Agent Creator** - Generated specialized AI agents based on your needs

**Next Steps:**
- Configure your GEMINI_API_KEY in environment variables to enable full AI orchestration
- The orchestrator will then coordinate multiple specialized agents to create your solution

**What the full orchestrator would do:**
- Coordinate 12+ specialized AI agents
- Analyze requirements in detail
- Create optimized agent configurations
- Test and validate solutions
- Generate documentation
- Prepare for deployment

To enable full functionality, please set up your API key in the environment variables.`;
  }

  private generateErrorResponse(userRequest: string, error: any): string {
    return `⚠️ **Orchestrator Error**

I encountered an issue while processing your request: "${userRequest}"

**Error Details:** ${error.message || 'Unknown error'}

**What happened:**
- The orchestrator attempted to coordinate multiple AI agents
- An error occurred during the process
- I've provided a fallback response

**To resolve this:**
1. Check your GEMINI_API_KEY configuration
2. Ensure the API key is valid and has sufficient quota
3. Try again with a simpler request

**Demo agents were created as fallback.**`;
  }
} 