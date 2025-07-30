import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Clock,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import { AgentConfig } from '../app/page';

interface AnalyticsDashboardProps {
  agent: AgentConfig;
  allAgents: AgentConfig[];
}

export function AnalyticsDashboard({ agent, allAgents }: AnalyticsDashboardProps) {
  const totalInteractions = allAgents.reduce((sum, a) => sum + a.analytics.interactions, 0);
  const avgSatisfaction = allAgents.length > 0 
    ? allAgents.reduce((sum, a) => sum + a.analytics.satisfaction, 0) / allAgents.length 
    : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor performance and usage across all your agents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {allAgents.length} Total Agents
            </Badge>
            <Badge variant="secondary">
              {totalInteractions.toLocaleString()} Interactions
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <div className="border-b px-6">
            <TabsList>
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-2">
                <Target className="w-4 h-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="usage" className="gap-2">
                <Users className="w-4 h-4" />
                Usage
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Total Interactions</span>
                      </div>
                      <div className="text-2xl font-bold">{agent.analytics.interactions.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from last week
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Satisfaction</span>
                      </div>
                      <div className="text-2xl font-bold">{agent.analytics.satisfaction}%</div>
                      <p className="text-xs text-muted-foreground">
                        Above average
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">Response Time</span>
                      </div>
                      <div className="text-2xl font-bold">1.2s</div>
                      <p className="text-xs text-muted-foreground">
                        Average response
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">Uptime</span>
                      </div>
                      <div className="text-2xl font-bold">{agent.analytics.uptime}%</div>
                      <p className="text-xs text-muted-foreground">
                        Last 30 days
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Agent Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Agent: {agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Performance Score</span>
                            <span>{agent.analytics.performance}%</span>
                          </div>
                          <Progress value={agent.analytics.performance} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>User Satisfaction</span>
                            <span>{agent.analytics.satisfaction}%</span>
                          </div>
                          <Progress value={agent.analytics.satisfaction} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Uptime</span>
                            <span>{agent.analytics.uptime}%</span>
                          </div>
                          <Progress value={agent.analytics.uptime} />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Status</span>
                          <Badge variant={agent.metadata.status === 'deployed' ? 'default' : 'secondary'}>
                            {agent.metadata.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Category</span>
                          <Badge variant="outline">{agent.metadata.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Created</span>
                          <span className="text-sm text-muted-foreground">
                            {agent.metadata.created.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Last Updated</span>
                          <span className="text-sm text-muted-foreground">
                            {agent.metadata.updated.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* All Agents Overview */}
                {allAgents.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>All Agents Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {allAgents.map((agentItem) => (
                          <div key={agentItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{agentItem.name}</p>
                              <p className="text-xs text-muted-foreground">{agentItem.metadata.category}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-center">
                                <p className="font-medium">{agentItem.analytics.interactions}</p>
                                <p className="text-xs text-muted-foreground">Interactions</p>
                              </div>
                              <div className="text-center">
                                <p className="font-medium">{agentItem.analytics.satisfaction}%</p>
                                <p className="text-xs text-muted-foreground">Satisfaction</p>
                              </div>
                              <Badge variant={agentItem.metadata.status === 'deployed' ? 'default' : 'secondary'}>
                                {agentItem.metadata.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="performance" className="flex-1 m-0 p-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Detailed performance analytics and trends will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="flex-1 m-0 p-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Usage patterns and user interaction data will be shown here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}