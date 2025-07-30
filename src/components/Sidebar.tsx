import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Save, 
  Plus, 
  FolderOpen, 
  Clock,
  TrendingUp,
  Zap,
  AlertCircle,
  CheckCircle,
  Rocket,
  Download
} from 'lucide-react';
import { NavigationView, AgentConfig } from '../app/page';

interface SidebarItem {
  id: NavigationView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface SidebarProps {
  items: SidebarItem[];
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
  agent: AgentConfig | null;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onCreateNewAgent: () => void;
  onDeployAgent: () => void;
  onDownloadAgent: () => void;
  isCreatingAgent: boolean;
  deploymentStatus: string;
  exportedAgent: any;
}

export function Sidebar({ 
  items, 
  currentView, 
  onViewChange, 
  agent, 
  hasUnsavedChanges, 
  onSave,
  onCreateNewAgent,
  onDeployAgent,
  onDownloadAgent,
  isCreatingAgent,
  deploymentStatus,
  exportedAgent
}: SidebarProps) {
  const getCompletionPercentage = () => {
    if (!agent) return 0;
    
    let completed = 0;
    const total = 8;
    
    if (agent.name && agent.name !== 'Untitled Agent') completed++;
    if (agent.description) completed++;
    if (agent.capabilities.skills.length > 0) completed++;
    if (agent.personality.tone !== 'professional') completed++;
    if (agent.behavior.conversationFlow !== 'mixed') completed++;
    if (agent.training.examples.length > 0) completed++;
    if (agent.deployment?.status === 'deployed') completed++;
    if (agent.metadata.category !== 'general') completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'text-green-500';
      case 'testing': return 'text-yellow-500';
      case 'draft': return 'text-gray-500';
      case 'archived': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="w-4 h-4" />;
      case 'testing': return <Clock className="w-4 h-4" />;
      case 'draft': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">AI Studio</h2>
            <p className="text-xs text-sidebar-foreground/60">Professional Edition</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 gap-2"
            onClick={onCreateNewAgent}
          >
            <Plus className="w-4 h-4" />
            New Agent
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            Open
          </Button>
        </div>
      </div>

      {/* Current Agent Status */}
      {agent && (
        <div className="p-4 border-b border-sidebar-border bg-sidebar-accent/20">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {agent.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-sidebar-foreground truncate">
                {agent.name}
              </p>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${getStatusColor(agent.metadata.status)}`}>
                  {getStatusIcon(agent.metadata.status)}
                </span>
                <span className="text-xs text-sidebar-foreground/60 capitalize">
                  {agent.metadata.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sidebar-foreground/60">Completion</span>
              <span className="text-sidebar-foreground font-medium">
                {getCompletionPercentage()}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>

          {hasUnsavedChanges && (
            <Button
              onClick={onSave}
              size="sm"
              className="w-full mt-3 gap-2 bg-orange-600 hover:bg-orange-700"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          )}
          
          {agent && agent.metadata.status === 'draft' && (
            <Button
              onClick={onDeployAgent}
              disabled={isCreatingAgent}
              size="sm"
              className="w-full mt-2 gap-2 bg-green-600 hover:bg-green-700"
            >
              <Rocket className="w-4 h-4" />
              {isCreatingAgent ? 'Deploying...' : 'Deploy Agent'}
            </Button>
          )}
          
          {deploymentStatus && (
            <div className="mt-2 p-3 text-xs bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 shadow-sm">
              {(() => {
                let htmlContent = deploymentStatus.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                htmlContent = htmlContent.replace(/\n/g, '<br/>');
                htmlContent = htmlContent.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
                return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
              })()}
            </div>
          )}
          
          {exportedAgent && (
            <Button
              onClick={onDownloadAgent}
              size="sm"
              className="w-full mt-2 gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Download Code
            </Button>
          )}
        </div>
      )}

      {/* Navigation Items */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
            Workspace
          </p>
          
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${
                    isActive 
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs opacity-60">{item.description}</p>
                  </div>
                  {item.id === 'analytics' && agent?.analytics?.interactions && agent.analytics.interactions > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {agent.analytics.interactions}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <Separator className="mx-4" />

        {/* Quick Stats */}
        {agent && (
          <div className="p-4">
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3">
              Quick Stats
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-sidebar-foreground/80">Interactions</span>
                <Badge variant="outline" className="text-xs">
                  {agent.analytics.interactions || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-sidebar-foreground/80">Satisfaction</span>
                <Badge variant="outline" className="text-xs">
                  {agent.analytics.satisfaction || 0}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-sidebar-foreground/80">Uptime</span>
                <Badge variant="outline" className="text-xs">
                  {agent.analytics.uptime || 0}%
                </Badge>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>
    </div>
  );
}