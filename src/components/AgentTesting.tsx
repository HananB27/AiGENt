import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Play, 
  Bot, 
  Target, 
  Settings,
  Sparkles, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  Clock,
  TrendingUp,
  Zap,
  RefreshCw,
  Save,
  Download
} from 'lucide-react';
import { AgentConfig } from '../app/page';

interface TestResult {
  id: string;
  timestamp: Date;
  testType: string;
  scenario: string;
  response: string;
  analysis: {
    relevance: number;
    accuracy: number;
    personality_match: number;
    helpfulness: number;
    design_consistency: number;
    overall_score: number;
    feedback: string;
  };
}

interface AgentTestingProps {
  agent: AgentConfig | null;
  savedAgents: AgentConfig[];
  onAgentSelect: (agent: AgentConfig) => void;
}

const testScenarios = {
  personality: [
    "A user asks for help with a complex technical problem",
    "A customer is frustrated and needs emotional support",
    "Someone asks for creative writing assistance",
    "A user wants a quick, direct answer to a simple question",
    "A professional asks for detailed analysis and recommendations"
  ],
  capability: [
    "Help debug a JavaScript error in a React component",
    "Translate a business document from English to Spanish",
    "Create a marketing strategy for a new product launch",
    "Analyze customer feedback data and provide insights",
    "Design a user interface for a mobile app"
  ],
  behavior: [
    "A user asks a question outside the agent's expertise",
    "Someone provides incomplete information for a request",
    "A customer asks the same question multiple times",
    "A user wants to escalate to a human representative",
    "Someone asks for information that requires context from previous conversations"
  ]
};

const testTypes = [
  { id: 'personality', name: 'Personality Test', description: 'Test how well the agent maintains its personality', icon: Sparkles },
  { id: 'capability', name: 'Capability Test', description: 'Test the agent\'s skills and abilities', icon: Target },
  { id: 'behavior', name: 'Behavior Test', description: 'Test conversation flow and fallback behavior', icon: Settings }
];

export function AgentTesting({ agent, savedAgents, onAgentSelect }: AgentTestingProps) {
  const [selectedTestType, setSelectedTestType] = useState('personality');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);

  const handleRunTest = async () => {
    if (!agent) return;
    
    const scenario = customScenario || selectedScenario;
    if (!scenario) return;

    setIsRunningTest(true);
    setCurrentResult(null);

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent,
          testScenario: scenario,
          testType: selectedTestType
        })
      });

      if (!response.ok) {
        throw new Error('Test failed');
      }

      const result = await response.json();
      
      const newResult: TestResult = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        testType: selectedTestType,
        scenario,
        response: result.response,
        analysis: result.analysis
      };

      setTestResults(prev => [newResult, ...prev]);
      setCurrentResult(newResult);
      
      // Clear custom scenario after successful test
      if (customScenario) {
        setCustomScenario('');
      }
      
    } catch (error) {
      console.error('Test error:', error);
      alert('Failed to run test. Please try again.');
    } finally {
      setIsRunningTest(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const exportTestResults = () => {
    const data = {
      agent: agent?.name,
      timestamp: new Date().toISOString(),
      results: testResults
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${agent?.name || 'agent'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex">
      {/* Agent Selection & Test Configuration */}
      <div className="w-1/3 border-r p-6 space-y-6">
        {/* Agent Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Select Agent to Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={agent?.id || ''}
              onValueChange={(value) => {
                const selectedAgent = savedAgents.find(a => a.id === value);
                if (selectedAgent) onAgentSelect(selectedAgent);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent to test" />
              </SelectTrigger>
              <SelectContent>
                {savedAgents.map((savedAgent) => (
                  <SelectItem key={savedAgent.id} value={savedAgent.id}>
                    {savedAgent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {agent && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium">{agent.name}</h4>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="secondary">{agent.personality.tone}</Badge>
                  <Badge variant="secondary">{agent.personality.expertise}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Test Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Test Type Selection */}
            <div className="space-y-2">
              <Label>Test Type</Label>
              <div className="grid gap-2">
                {testTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={selectedTestType === type.id ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => setSelectedTestType(type.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs opacity-70">{type.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Scenario Selection */}
            <div className="space-y-2">
              <Label>Test Scenario</Label>
              <Select
                value={selectedScenario}
                onValueChange={setSelectedScenario}
                disabled={!!customScenario}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a scenario or write custom" />
                </SelectTrigger>
                <SelectContent>
                  {testScenarios[selectedTestType as keyof typeof testScenarios]?.map((scenario, index) => (
                    <SelectItem key={index} value={scenario}>
                      {scenario}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Scenario */}
            <div className="space-y-2">
              <Label>Custom Scenario (Optional)</Label>
              <Textarea
                placeholder="Write your own test scenario..."
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                rows={3}
              />
            </div>

            {/* Run Test Button */}
            <Button
              onClick={handleRunTest}
              disabled={!agent || isRunningTest || (!selectedScenario && !customScenario)}
              className="w-full gap-2"
            >
              {isRunningTest ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Test...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Statistics */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Test Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Tests</span>
                <Badge variant="secondary">{testResults.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Score</span>
                <Badge variant="secondary">
                  {Math.round(testResults.reduce((sum, r) => sum + r.analysis.overall_score, 0) / testResults.length)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Best Score</span>
                <Badge variant="secondary">
                  {Math.max(...testResults.map(r => r.analysis.overall_score))}%
                </Badge>
              </div>
              
              <Separator />
              
              <Button
                onClick={exportTestResults}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" />
                Export Results
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Test Results */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-primary" />
              Agent Testing Lab
            </h1>
            <p className="text-muted-foreground mt-1">
              Test your AI agents with various scenarios and analyze their performance
            </p>
        </div>
      </div>

        {!agent ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Agent Selected</h3>
              <p className="text-muted-foreground">
                Select an agent from the sidebar to start testing
              </p>
            </CardContent>
          </Card>
        ) : currentResult ? (
          <div className="space-y-6">
            {/* Current Test Result */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Latest Test Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Test Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline">{currentResult.testType}</Badge>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {currentResult.timestamp.toLocaleString()}
                    </span>
                  </div>
                  {getScoreBadge(currentResult.analysis.overall_score)}
                    </div>

                {/* Scenario */}
                <div>
                  <Label className="text-sm font-medium">Test Scenario</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentResult.scenario}</p>
                    </div>

                {/* Agent Response */}
                <div>
                  <Label className="text-sm font-medium">Agent Response</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{currentResult.response}</p>
                  </div>
                </div>

                {/* Analysis Metrics */}
                <div>
                  <Label className="text-sm font-medium">Performance Analysis</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Relevance</span>
                        <span className={getScoreColor(currentResult.analysis.relevance)}>
                          {currentResult.analysis.relevance}%
                        </span>
              </div>
                      <Progress value={currentResult.analysis.relevance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span className={getScoreColor(currentResult.analysis.accuracy)}>
                          {currentResult.analysis.accuracy}%
                              </span>
                      </div>
                      <Progress value={currentResult.analysis.accuracy} className="h-2" />
                        </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Personality Match</span>
                        <span className={getScoreColor(currentResult.analysis.personality_match)}>
                          {currentResult.analysis.personality_match}%
                        </span>
                      </div>
                      <Progress value={currentResult.analysis.personality_match} className="h-2" />
                    </div>
                                         <div>
                       <div className="flex justify-between text-sm mb-1">
                         <span>Helpfulness</span>
                         <span className={getScoreColor(currentResult.analysis.helpfulness)}>
                           {currentResult.analysis.helpfulness}%
                         </span>
                       </div>
                       <Progress value={currentResult.analysis.helpfulness} className="h-2" />
                     </div>
                     <div>
                       <div className="flex justify-between text-sm mb-1">
                         <span>Design Consistency</span>
                         <span className={getScoreColor(currentResult.analysis.design_consistency)}>
                           {currentResult.analysis.design_consistency}%
                         </span>
                       </div>
                       <Progress value={currentResult.analysis.design_consistency} className="h-2" />
                     </div>
                </div>
                </div>

                {/* Feedback */}
                <div>
                  <Label className="text-sm font-medium">Feedback</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentResult.analysis.feedback}</p>
                </div>
              </CardContent>
            </Card>
                        </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Ready to Test</h3>
              <p className="text-muted-foreground">
                Configure your test scenario and click "Run Test" to start testing your agent
              </p>
                      </CardContent>
                    </Card>
        )}

        {/* Test History */}
                {testResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Test History</h2>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {testResults.slice(1).map((result) => (
                  <Card key={result.id} className="cursor-pointer hover:bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{result.testType}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {result.timestamp.toLocaleString()}
                              </span>
                          </div>
                          <p className="text-sm mt-1 line-clamp-2">{result.scenario}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${getScoreColor(result.analysis.overall_score)}`}>
                            {result.analysis.overall_score}%
                                </div>
                          {getScoreBadge(result.analysis.overall_score)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}