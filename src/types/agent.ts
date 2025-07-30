export enum AgentCategory {
  PLANNER = 'planner',
  ANALYZER = 'analyzer',
  CREATOR = 'creator',
  TESTER = 'tester',
  VALIDATOR = 'validator',
  OPTIMIZER = 'optimizer',
  DOCUMENTER = 'documenter',
  DEPLOYER = 'deployer',
  MONITOR = 'monitor',
  COORDINATOR = 'coordinator',
  SECURITY = 'security',
  PERFORMANCE = 'performance'
}

export enum RequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum ProcessingStep {
  ANALYZING = 'analyzing',
  PLANNING = 'planning',
  CREATING_AGENTS = 'creating_agents',
  TESTING = 'testing',
  VALIDATING = 'validating',
  OPTIMIZING = 'optimizing',
  DEPLOYING = 'deploying',
  COMPLETED = 'completed'
}

export enum TestType {
  FUNCTIONALITY = 'functionality',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  INTEGRATION = 'integration',
  USABILITY = 'usability'
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  prompt: string;
  capabilities: string[];
  category: AgentCategory;
  status: 'active' | 'inactive' | 'testing' | 'deployed' | 'archived';
  createdAt: Date;
  updatedAt?: Date;
  dependencies?: string[];
  testResults?: TestResult[];
  performance?: PerformanceMetrics;
  configuration?: AgentConfiguration;
}

export interface AgentConfiguration {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences?: string[];
  systemPrompt?: string;
}

export interface PerformanceMetrics {
  responseTime: number;
  accuracy: number;
  throughput: number;
  errorRate: number;
  userSatisfaction: number;
  lastUpdated: Date;
}

export interface TestResult {
  id: string;
  agentId: string;
  testType: TestType;
  passed: boolean;
  score: number;
  feedback: string;
  timestamp: Date;
  details?: any;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface OrchestratorRequest {
  id: string;
  userRequest: string;
  userId: string;
  timestamp: Date;
  status: RequestStatus;
  currentStep: ProcessingStep;
  stepProgress: number;
  stepDescription: string;
  generatedAgents: string[];
  conversationHistory: Message[];
  agentConfigs?: any[]; // Store agent configurations for download
  error?: string;
  metadata?: any;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  features: string[];
  pricing: 'free' | 'premium' | 'enterprise';
  rating: number;
  downloads: number;
  preview: string;
  config: Partial<AgentConfiguration>;
  icon: React.ReactNode;
  gradient: string;
}

export interface AgentDeployment {
  id: string;
  agentId: string;
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'deploying' | 'active' | 'failed' | 'stopped';
  url?: string;
  deployedAt?: Date;
  configuration: DeploymentConfiguration;
  logs: DeploymentLog[];
}

export interface DeploymentConfiguration {
  platform: 'vercel' | 'aws' | 'gcp' | 'azure' | 'custom';
  region: string;
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  environment: Record<string, string>;
  scaling: {
    minInstances: number;
    maxInstances: number;
    autoScaling: boolean;
  };
}

export interface DeploymentLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  metadata?: any;
}

export interface AgentAnalytics {
  agentId: string;
  period: 'hour' | 'day' | 'week' | 'month';
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    userSatisfaction: number;
    uniqueUsers: number;
  };
  trends: {
    requestsPerHour: number[];
    responseTimeTrend: number[];
    errorRateTrend: number[];
  };
  topQueries: Array<{
    query: string;
    count: number;
    averageSatisfaction: number;
  }>;
}

export interface AgentConfig {
  name: string;
  description: string;
  personality: {
    tone: string;
    style: string;
    expertise: string;
  };
  capabilities: {
    knowledgeBases: string[];
    skills: string[];
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    avatar: string;
  };
  generatedCode?: any;
  deployment?: {
    platform: string;
    status: string;
    architecture?: string;
    deploymentUrl?: string | null;
    deploymentId?: string | null;
  };
} 