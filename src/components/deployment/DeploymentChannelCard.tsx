import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, Settings, Clock, Rocket } from 'lucide-react';
import { DeploymentChannel, statusColors, difficultyColors } from '../constants/deploymentChannels';

interface DeploymentChannelCardProps {
  channel: DeploymentChannel;
  onDeploy: (channelId: string) => void;
}

export function DeploymentChannelCard({ channel, onDeploy }: DeploymentChannelCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {channel.icon}
              </div>
              <div>
                <CardTitle className="text-base">{channel.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {channel.estimatedTime} setup
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Badge 
                variant="outline" 
                className={`text-xs ${statusColors[channel.status]}`}
              >
                {channel.status}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${difficultyColors[channel.difficulty]}`}
              >
                {channel.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {channel.description}
          </p>
          
          <div className="space-y-2">
            <p className="text-xs font-medium">Features:</p>
            <div className="flex flex-wrap gap-1">
              {channel.features.slice(0, 3).map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {channel.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{channel.features.length - 3}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-medium">Requirements:</p>
            <div className="text-xs text-muted-foreground">
              {channel.requirements.join(', ')}
            </div>
          </div>
          
          <div className="flex gap-2">
            {channel.status === 'deployed' ? (
              <>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Eye className="w-3 h-3" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Settings className="w-3 h-3" />
                  Config
                </Button>
              </>
            ) : channel.status === 'configuring' ? (
              <Button size="sm" className="w-full gap-1">
                <Clock className="w-3 h-3" />
                Continue Setup
              </Button>
            ) : (
              <Button 
                onClick={() => onDeploy(channel.id)}
                size="sm" 
                className="w-full gap-1"
              >
                <Rocket className="w-3 h-3" />
                Deploy
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}