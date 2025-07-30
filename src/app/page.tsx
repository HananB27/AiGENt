"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { AgentBuilder } from '../components/AgentBuilder';
import { AgentMarketplace } from '../components/AgentMarketplace';
import { AgentTesting } from '../components/AgentTesting';
import { DeploymentCenter } from '../components/DeploymentCenter';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { SettingsPanel } from '../components/SettingsPanel';
import { OrchestratorView } from '../components/OrchestratorView';
import { Toaster } from '../components/ui/sonner';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  TestTube, 
  Rocket, 
  BarChart3, 
  Settings,
  Save,
  Eye,
  Zap,
  Brain
} from 'lucide-react';

export type NavigationView = 'orchestrator' | 'builder' | 'marketplace' | 'testing' | 'deployment' | 'analytics' | 'settings';

interface SidebarItem {
  id: NavigationView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  personality: {
    tone: string;
    style: string;
    expertise: string;
    responseLength: 'concise' | 'detailed' | 'adaptive';
    creativity: number; // 0-100
    formality: number; // 0-100
  };
  capabilities: {
    skills: string[];
    languages: string[];
    integrations: string[];
    knowledgeBases: string[];
  };
  behavior: {
    conversationFlow: 'guided' | 'open' | 'mixed';
    memory: boolean;
    learningMode: boolean;
    contextWindow: number;
    fallbackBehavior: string;
  };
  training: {
    documents: File[];
    examples: Array<{ input: string; output: string }>;
    restrictions: string[];
    guidelines: string[];
  };
  design: {
    avatar: {
      type: string;
      value: string;
      backgroundColor: string;
      textColor: string;
    };
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: number;
    };
    chatInterface: {
      bubbleStyle: string;
      fontSize: string;
      spacing: string;
      fontFamily: string;
      agentBubbleColor: string;
      userBubbleColor: string;
    };
    widget: {
      greeting: string;
      placeholder: string;
      showCompanyBranding: boolean;
    };
    branding: {
      companyName: string;
      tagline: string;
    };
  };
  metadata: {
    category: string;
    tags: string[];
    version: string;
    created: Date;
    updated: Date;
    status: 'draft' | 'testing' | 'deployed' | 'archived';
  };
  analytics: {
    interactions: number;
    satisfaction: number;
    performance: number;
    uptime: number;
  };
  generatedCode?: any; // Generated Next.js code from orchestrator
  deployment?: {
    platform: string;
    status: string;
    architecture?: string;
    deploymentUrl?: string | null;
    deploymentId?: string | null;
  };
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  features: string[];
  pricing: 'free' | 'premium' | 'enterprise';
  rating: number;
  downloads: number;
  preview: string;
  config: Partial<AgentConfig>;
  icon: React.ReactNode;
  gradient: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<NavigationView>('orchestrator');
  const [currentAgent, setCurrentAgent] = useState<AgentConfig | null>(null);
  const [savedAgents, setSavedAgents] = useState<AgentConfig[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [exportedAgent, setExportedAgent] = useState<any>(null);
  const [showDeploymentSuccess, setShowDeploymentSuccess] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string>('');

  // Initialize with a default agent if none exists
  useEffect(() => {
    if (!currentAgent) {
      const defaultAgent: AgentConfig = {
        id: crypto.randomUUID(),
        name: 'Untitled Agent',
        description: '',
        personality: {
          tone: 'professional',
          style: 'helpful',
          expertise: 'general',
          responseLength: 'adaptive',
          creativity: 50,
          formality: 50
        },
        capabilities: {
          skills: [],
          languages: ['English'],
          integrations: [],
          knowledgeBases: []
        },
        behavior: {
          conversationFlow: 'mixed',
          memory: true,
          learningMode: false,
          contextWindow: 4096,
          fallbackBehavior: 'apologetic'
        },
        training: {
          documents: [],
          examples: [],
          restrictions: [],
          guidelines: []
        },
        design: {
          avatar: {
            type: 'icon',
            value: 'Bot',
            backgroundColor: '#3b82f6',
            textColor: '#ffffff'
          },
          theme: {
            primaryColor: '#3b82f6',
            secondaryColor: '#e0f2fe',
            accentColor: '#0ea5e9',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            borderRadius: 8
          },
          chatInterface: {
            bubbleStyle: 'rounded',
            fontSize: 'medium',
            spacing: 'normal',
            fontFamily: 'Inter',
            agentBubbleColor: '#f3f4f6',
            userBubbleColor: '#3b82f6'
          },
          widget: {
            greeting: 'Hello! How can I help you today?',
            placeholder: 'Type your message...',
            showCompanyBranding: false
          },
          branding: {
            companyName: '',
            tagline: 'AI Assistant'
          }
        },
        metadata: {
          category: 'general',
          tags: [],
          version: '1.0.0',
          created: new Date(),
          updated: new Date(),
          status: 'draft'
        },
        analytics: {
          interactions: 0,
          satisfaction: 0,
          performance: 0,
          uptime: 0
        }
      };
      setCurrentAgent(defaultAgent);
    }
  }, [currentAgent]);

  const handleSaveAgent = () => {
    if (!currentAgent) return;
    
    const updatedAgent = {
      ...currentAgent,
      metadata: {
        ...currentAgent.metadata,
        updated: new Date()
      }
    };
    
    const existingIndex = savedAgents.findIndex(agent => agent.id === currentAgent.id);
    if (existingIndex >= 0) {
      setSavedAgents(prev => prev.map((agent, index) => 
        index === existingIndex ? updatedAgent : agent
      ));
    } else {
      setSavedAgents(prev => [...prev, updatedAgent]);
    }
    
    setCurrentAgent(updatedAgent);
    setHasUnsavedChanges(false);
  };

  const handleAgentUpdate = (updates: Partial<AgentConfig>) => {
    if (!currentAgent) return;
    
    setCurrentAgent(prev => ({
      ...prev!,
      ...updates,
      metadata: {
        ...prev!.metadata,
        updated: new Date()
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleCreateNewAgent = () => {
    const newAgent: AgentConfig = {
      id: crypto.randomUUID(),
      name: 'Untitled Agent',
      description: '',
      personality: {
        tone: 'professional',
        style: 'helpful',
        expertise: 'general',
        responseLength: 'adaptive',
        creativity: 50,
        formality: 50
      },
      capabilities: {
        skills: [],
        languages: ['English'],
        integrations: [],
        knowledgeBases: []
      },
      behavior: {
        conversationFlow: 'mixed',
        memory: true,
        learningMode: false,
        contextWindow: 4096,
        fallbackBehavior: 'apologetic'
      },
      training: {
        documents: [],
        examples: [],
        restrictions: [],
        guidelines: []
      },
      design: {
        avatar: {
          type: 'icon',
          value: 'Bot',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff'
        },
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#e0f2fe',
          accentColor: '#0ea5e9',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          borderRadius: 8
        },
        chatInterface: {
          bubbleStyle: 'rounded',
          fontSize: 'medium',
          spacing: 'normal',
          fontFamily: 'Inter',
          agentBubbleColor: '#f3f4f6',
          userBubbleColor: '#3b82f6'
        },
        widget: {
          greeting: 'Hello! How can I help you today?',
          placeholder: 'Type your message...',
          showCompanyBranding: false
        },
        branding: {
          companyName: '',
          tagline: 'AI Assistant'
        }
      },
      metadata: {
        category: 'general',
        tags: [],
        version: '1.0.0',
        created: new Date(),
        updated: new Date(),
        status: 'draft'
      },
      analytics: {
        interactions: 0,
        satisfaction: 0,
        performance: 0,
        uptime: 0
      }
    };
    
    setCurrentAgent(newAgent);
    setCurrentView('builder');
    setHasUnsavedChanges(true);
  };

  const handleDeployAgent = async () => {
    if (!currentAgent) return;
    
    setIsCreatingAgent(true);
    setDeploymentStatus('Preparing deployment...');
    
    try {
      const exportConfig = {
        format: 'nextjs' as const,
        platform: 'vercel' as const,
        features: ['chat', 'api'],
        includeApi: true,
        includeDatabase: false,
        includeAuth: false
      };
      
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: currentAgent, exportConfig })
      });
      
      if (!response.ok) {
        throw new Error('Failed to export agent');
      }
      
      const result = await response.json();
      
      if (result.success && result.exportedAgent) {
        setExportedAgent(result.exportedAgent);
        setDeploymentStatus(result.exportedAgent.deploymentMessage || '✅ Agent prepared successfully!');
        
        // Show deployment success modal if URL is available
        if (result.exportedAgent.deploymentUrl) {
          setDeploymentUrl(result.exportedAgent.deploymentUrl);
          setShowDeploymentSuccess(true);
        }
        
        // Update agent status
        handleAgentUpdate({
          metadata: {
            ...currentAgent.metadata,
            status: 'deployed'
          }
        });
      } else {
        setDeploymentStatus('❌ Deployment failed. Please try again.');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('❌ Deployment failed. Please check your configuration.');
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const handleDownloadAgent = async () => {
    if (!exportedAgent) return;
    
    try {
      const response = await fetch('/api/export/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exportedAgent })
      });
      
      if (!response.ok) {
        throw new Error('Failed to download agent');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportedAgent.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download agent. Please try again.');
    }
  };

  const handleLoadTemplate = (template: AgentTemplate) => {
    const newAgent: AgentConfig = {
      id: crypto.randomUUID(),
      name: template.name,
      description: template.description,
      personality: template.config.personality || {
        tone: 'professional',
        style: 'helpful',
        expertise: 'general',
        responseLength: 'adaptive',
        creativity: 50,
        formality: 50
      },
      capabilities: template.config.capabilities || {
        skills: [],
        languages: ['English'],
        integrations: [],
        knowledgeBases: []
      },
      behavior: template.config.behavior || {
        conversationFlow: 'mixed',
        memory: true,
        learningMode: false,
        contextWindow: 4096,
        fallbackBehavior: 'apologetic'
      },
      training: template.config.training || {
        documents: [],
        examples: [],
        restrictions: [],
        guidelines: []
      },
      design: template.config.design || {
        avatar: {
          type: 'icon',
          value: 'Bot',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff'
        },
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#e0f2fe',
          accentColor: '#0ea5e9',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          borderRadius: 8
        },
        chatInterface: {
          bubbleStyle: 'rounded',
          fontSize: 'medium',
          spacing: 'normal',
          fontFamily: 'Inter',
          agentBubbleColor: '#f3f4f6',
          userBubbleColor: '#3b82f6'
        },
        widget: {
          greeting: 'Hello! How can I help you today?',
          placeholder: 'Type your message...',
          showCompanyBranding: false
        },
        branding: {
          companyName: '',
          tagline: 'AI Assistant'
        }
      },
      metadata: {
        category: template.category,
        tags: template.features,
        version: '1.0.0',
        created: new Date(),
        updated: new Date(),
        status: 'draft'
      },
      analytics: {
        interactions: 0,
        satisfaction: 0,
        performance: 0,
        uptime: 0
      }
    };
    
    setCurrentAgent(newAgent);
    setCurrentView('builder');
    setHasUnsavedChanges(true);
  };

  const navigationItems: SidebarItem[] = [
    { id: 'orchestrator', label: 'Orchestrator', icon: Brain, description: 'Manage and coordinate multiple agents' },
    { id: 'builder', label: 'Agent Builder', icon: Bot, description: 'Design and configure your agent' },
    { id: 'marketplace', label: 'Marketplace', icon: Sparkles, description: 'Browse templates and examples' },
    { id: 'testing', label: 'Testing Lab', icon: TestTube, description: 'Test and refine your agent' },
    { id: 'deployment', label: 'Deployment', icon: Rocket, description: 'Deploy and manage your agents' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Monitor performance and usage' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Configure platform settings' }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'orchestrator':
        return <OrchestratorView />;
      case 'builder':
        return currentAgent ? (
          <AgentBuilder 
            agent={currentAgent}
            onUpdate={handleAgentUpdate}
            onSave={handleSaveAgent}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No agent selected</p>
          </div>
        );
      case 'marketplace':
        return (
          <AgentMarketplace 
            onLoadTemplate={handleLoadTemplate}
            savedAgents={savedAgents}
            onLoadAgent={setCurrentAgent}
          />
        );
      case 'testing':
        return (
          <AgentTesting
            agent={currentAgent}
            savedAgents={savedAgents}
            onAgentSelect={setCurrentAgent}
          />
        );
      case 'deployment':
        return currentAgent ? (
          <DeploymentCenter 
            agent={currentAgent}
            onUpdate={handleAgentUpdate}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No agent selected</p>
          </div>
        );
      case 'analytics':
        return currentAgent ? (
          <AnalyticsDashboard 
            agent={currentAgent}
            allAgents={savedAgents}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No agent selected</p>
          </div>
        );
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
              <Sidebar
          items={navigationItems}
          currentView={currentView}
          onViewChange={setCurrentView}
          agent={currentAgent}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSaveAgent}
          onCreateNewAgent={handleCreateNewAgent}
          onDeployAgent={handleDeployAgent}
          onDownloadAgent={handleDownloadAgent}
          isCreatingAgent={isCreatingAgent}
          deploymentStatus={deploymentStatus}
          exportedAgent={exportedAgent}
        />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold">AI Agent Studio</h1>
              </div>
              {currentAgent && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>/</span>
                  <span>{currentAgent.name}</span>
                  <Badge variant={
                    currentAgent.metadata.status === 'deployed' ? 'default' :
                    currentAgent.metadata.status === 'testing' ? 'secondary' :
                    'outline'
                  }>
                    {currentAgent.metadata.status}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-1" />
                  Unsaved
                </Badge>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button
                onClick={handleSaveAgent}
                disabled={!hasUnsavedChanges}
                size="sm"
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              
              {currentAgent?.metadata.status === 'deployed' && (
                <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                  <Zap className="w-4 h-4" />
                  Live
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Deployment Success Modal */}
      {showDeploymentSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🎉 Deployment Successful!
              </h3>
              
              <p className="text-gray-600 mb-4">
                Your AI agent is now live and ready to use!
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700 mb-2 font-medium">Your Agent URL:</p>
                <a 
                  href={deploymentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all text-sm"
                >
                  {deploymentUrl}
                </a>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => window.open(deploymentUrl, '_blank')}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🚀 Visit Agent
                </button>
                <button
                  onClick={() => setShowDeploymentSuccess(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  <strong>🎉 Zero Configuration:</strong> Your agent is fully functional with embedded API key - ready to chat immediately!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}