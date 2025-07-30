"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrchestratorAgent } from '../agents/orchestrator';
import { OrchestratorRequest, RequestStatus, ProcessingStep } from '../types/agent';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Bot, 
  Send, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Brain,
  Rocket,
  RefreshCw,
  Eye,
  Play,
  Sparkles,
  TestTube
} from 'lucide-react';

export function OrchestratorView() {
  const [orchestrator] = useState(() => new OrchestratorAgent());
  const [userRequest, setUserRequest] = useState('');
  const [currentRequest, setCurrentRequest] = useState<OrchestratorRequest | null>(null);
  const [requests, setRequests] = useState<OrchestratorRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agents, setAgents] = useState(orchestrator.getAgents());
  const [apiStatus, setApiStatus] = useState<'available' | 'unavailable' | 'checking'>('checking');

  useEffect(() => {
    // Load existing requests
    setRequests(orchestrator.getAllRequests());
    
    // Check API status from server
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/orchestrator/status');
        setApiStatus(response.ok ? 'available' : 'unavailable');
      } catch (error) {
        console.log('API status check failed:', error);
        setApiStatus('unavailable');
      }
    };
    
    checkApiStatus();
  }, []);

  const handleSubmitRequest = async () => {
    if (!userRequest.trim()) return;
    
    setIsProcessing(true);
    const request = await orchestrator.processUserRequest(userRequest, 'user-1');
    setCurrentRequest(request);
    setRequests(prev => [request, ...prev]);
    setUserRequest('');
    setIsProcessing(false);
  };

  const handleDownloadAgent = async (agentConfig: any) => {
    try {
      // @ts-ignore
      const exportedAgent = await (window as any).exportService.exportAgent(agentConfig);
      // Trigger download
      const blob = new Blob([exportedAgent], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${agentConfig.name.toLowerCase().replace(/\s+/g, '-')}-agent.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download agent:', error);
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED: return 'bg-green-500';
      case RequestStatus.PROCESSING: return 'bg-blue-500';
      case RequestStatus.FAILED: return 'bg-red-500';
      case RequestStatus.PENDING: return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED: return <CheckCircle className="w-4 h-4" />;
      case RequestStatus.PROCESSING: return <RefreshCw className="w-4 h-4 animate-spin" />;
      case RequestStatus.FAILED: return <AlertCircle className="w-4 h-4" />;
      case RequestStatus.PENDING: return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStepDescription = (step: ProcessingStep) => {
    switch (step) {
      case ProcessingStep.ANALYZING: return 'Analyzing requirements and planning...';
      case ProcessingStep.PLANNING: return 'Creating detailed plans...';
      case ProcessingStep.CREATING_AGENTS: return 'Generating specialized agents...';
      case ProcessingStep.TESTING: return 'Testing agent functionality...';
      case ProcessingStep.VALIDATING: return 'Validating agent quality...';
      case ProcessingStep.OPTIMIZING: return 'Optimizing performance...';
      case ProcessingStep.DEPLOYING: return 'Deploying agents...';
      case ProcessingStep.COMPLETED: return 'All agents ready!';
      default: return 'Processing...';
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">AI Agent Orchestrator</h1>
            <p className="text-muted-foreground">
              Coordinate multiple specialized AI agents to create powerful solutions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {agents.length} Agents Available
          </Badge>
          <Badge 
            variant={apiStatus === 'available' ? 'default' : 'secondary'} 
            className="text-sm"
          >
            {apiStatus === 'available' ? '🟢 API Ready' : 
             apiStatus === 'unavailable' ? '🔴 API Not Configured' : 
             '🟡 Checking API...'}
          </Badge>
        </div>
      </div>

      {/* API Status Alert */}
      {apiStatus === 'unavailable' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800 mb-1">API Not Configured</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  The orchestrator is running in demo mode. To enable full AI orchestration, configure your Gemini API key.
                </p>
                <div className="text-xs text-yellow-600 space-y-1">
                  <p><strong>To set up:</strong></p>
                  <p>1. Get a Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></p>
                  <p>2. Add <code className="bg-yellow-100 px-1 rounded">GEMINI_API_KEY=your_key_here</code> to your environment variables</p>
                  <p>3. Restart the application</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Input */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Create New Request
                {apiStatus === 'unavailable' && (
                  <Badge variant="outline" className="text-xs ml-2">
                    Demo Mode
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {apiStatus === 'unavailable' 
                  ? 'Describe what you need and see how the orchestrator would coordinate multiple AI agents (demo mode)'
                  : 'Describe what you need and the orchestrator will coordinate multiple AI agents to create the solution'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your requirements... (e.g., 'I need a customer service chatbot for my e-commerce site that can handle orders, returns, and product inquiries')"
                value={userRequest}
                onChange={(e) => setUserRequest(e.target.value)}
                rows={4}
                disabled={isProcessing}
              />
              <Button 
                onClick={handleSubmitRequest} 
                disabled={!userRequest.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {apiStatus === 'unavailable' ? 'Start Demo' : 'Start Orchestration'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Current Request Status */}
          {currentRequest && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Current Request Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(currentRequest.status)} text-white`}
                    >
                      {getStatusIcon(currentRequest.status)}
                      {currentRequest.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentRequest.stepDescription}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentRequest.stepProgress}%
                  </span>
                </div>
                <Progress value={currentRequest.stepProgress} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  <strong>Step:</strong> {getStepDescription(currentRequest.currentStep)}
                </div>
                {currentRequest.generatedAgents.length > 0 && (
                  <div className="text-sm">
                    <strong>Generated Agents:</strong> {currentRequest.generatedAgents.length}
                  </div>
                )}
                
                {/* Created Agents Display */}
                {currentRequest.agentConfigs && currentRequest.agentConfigs.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-sm">Created Agents:</h4>
                    <div className="grid gap-3">
                      {currentRequest.agentConfigs.map((agentConfig: any, index: number) => (
                        <Card key={agentConfig.id || index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                                style={{ backgroundColor: agentConfig.design?.primaryColor || '#3b82f6' }}
                              >
                                {agentConfig.design?.avatar || '🤖'}
                              </div>
                              <div>
                                <h5 className="font-medium">{agentConfig.name}</h5>
                                <p className="text-sm text-muted-foreground">{agentConfig.description}</p>
                                <div className="flex gap-1 mt-1">
                                  {agentConfig.capabilities?.skills?.slice(0, 3).map((skill: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleDownloadAgent(agentConfig)}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Conversation History */}
                {currentRequest.conversationHistory.length > 1 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="font-medium text-sm">Conversation:</h4>
                    {currentRequest.conversationHistory.slice(1).map((message) => (
                      <div key={message.id} className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">
                          {message.role === 'assistant' ? '🤖 Orchestrator' : '👤 You'}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Available Agents */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Available Agents
              </CardTitle>
              <CardDescription>
                Specialized AI agents that work together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">{agent.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {agent.category}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request History */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Request History
            </CardTitle>
            <CardDescription>
              Track all your orchestration requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium">{request.userRequest.substring(0, 100)}...</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(request.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(request.status)} text-white`}
                    >
                      {getStatusIcon(request.status)}
                      {request.status}
                    </Badge>
                    {request.status === RequestStatus.COMPLETED && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 