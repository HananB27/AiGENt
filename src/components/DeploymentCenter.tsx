import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { DeploymentChannelCard } from './deployment/DeploymentChannelCard';
import { deploymentChannels } from './constants/deploymentChannels';
import { 
  Rocket, 
  Globe, 
  Activity,
  Settings,
  Monitor
} from 'lucide-react';
import { AgentConfig } from '../app/page';

interface DeploymentCenterProps {
  agent: AgentConfig;
  onUpdate: (updates: Partial<AgentConfig>) => void;
}

export function DeploymentCenter({ agent, onUpdate }: DeploymentCenterProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const handleDeploy = (channelId: string) => {
    setSelectedChannel(channelId);
    // Simulate deployment process
    setTimeout(() => {
      onUpdate({
        metadata: {
          ...agent.metadata,
          status: 'deployed'
        },
        deployment: {
          platform: agent.deployment?.platform || 'vercel',
          status: 'deployed',
          architecture: agent.deployment?.architecture,
          deploymentUrl: agent.deployment?.deploymentUrl,
          deploymentId: agent.deployment?.deploymentId
        }
      });
      setSelectedChannel(null);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Rocket className="w-8 h-8 text-primary" />
              Deployment Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Deploy your agent across multiple channels and platforms
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={agent.metadata.status === 'deployed' ? 'default' : 'secondary'}>
              {agent.metadata.status}
            </Badge>
            <Badge variant="outline">
              {agent.deployment?.status === 'deployed' ? '1' : '0'} active deployments
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="channels" className="h-full flex flex-col">
          <div className="border-b px-6">
            <TabsList>
              <TabsTrigger value="channels" className="gap-2">
                <Globe className="w-4 h-4" />
                Deployment Channels
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="gap-2">
                <Activity className="w-4 h-4" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="channels" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Deployment Status Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Deployment Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {deploymentChannels.filter(c => c.status === 'deployed').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {deploymentChannels.filter(c => c.status === 'configuring').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Configuring</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {deploymentChannels.filter(c => c.status === 'available').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Available</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {deploymentChannels.filter(c => c.status === 'error').length}
                        </div>
                        <p className="text-sm text-muted-foreground">Errors</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deployment Channels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deploymentChannels.map((channel) => (
                    <DeploymentChannelCard
                      key={channel.id}
                      channel={channel}
                      onDeploy={handleDeploy}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="monitoring" className="flex-1 m-0 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Real-time Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">98.9%</div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">1.2s</div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Active Deployments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deploymentChannels
                      .filter(c => c.status === 'deployed')
                      .map((channel) => (
                        <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-primary/10 rounded">
                              {channel.icon}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{channel.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Last updated 2 hours ago
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600">Active</span>
                          </div>
                        </div>
                      ))}
                    
                    {deploymentChannels.filter(c => c.status === 'deployed').length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Rocket className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No active deployments</p>
                        <p className="text-sm">Deploy your agent to start monitoring</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 m-0 p-6">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Deployment settings and configuration options will be available here.
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