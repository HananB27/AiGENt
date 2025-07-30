import React from 'react';
import { 
  Globe, 
  Smartphone, 
  MessageCircle, 
  Code2, 
  Share2,
  Download
} from 'lucide-react';

export interface DeploymentChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'deployed' | 'configuring' | 'error';
  difficulty: 'easy' | 'medium' | 'advanced';
  features: string[];
  requirements: string[];
  estimatedTime: string;
}

export const deploymentChannels: DeploymentChannel[] = [
  {
    id: 'web-widget',
    name: 'Web Widget',
    description: 'Embed as a chat widget on any website',
    icon: <Globe className="w-5 h-5" />,
    status: 'available',
    difficulty: 'easy',
    features: ['Easy integration', 'Customizable UI', 'Mobile responsive', 'Analytics'],
    requirements: ['Basic HTML knowledge'],
    estimatedTime: '5 minutes'
  },
  {
    id: 'api',
    name: 'REST API',
    description: 'Integrate via API endpoints',
    icon: <Code2 className="w-5 h-5" />,
    status: 'deployed',
    difficulty: 'medium',
    features: ['Full control', 'Custom integration', 'Webhooks', 'Rate limiting'],
    requirements: ['API development experience'],
    estimatedTime: '30 minutes'
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    description: 'Native iOS and Android apps',
    icon: <Smartphone className="w-5 h-5" />,
    status: 'configuring',
    difficulty: 'advanced',
    features: ['Native performance', 'Push notifications', 'Offline mode', 'App store ready'],
    requirements: ['Mobile development setup'],
    estimatedTime: '2-3 hours'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Deploy on WhatsApp Business API',
    icon: <MessageCircle className="w-5 h-5" />,
    status: 'available',
    difficulty: 'medium',
    features: ['Business API', 'Media support', 'Templates', 'Analytics'],
    requirements: ['WhatsApp Business account'],
    estimatedTime: '45 minutes'
  },
  {
    id: 'slack',
    name: 'Slack Bot',
    description: 'Deploy as a Slack workspace bot',
    icon: <Share2 className="w-5 h-5" />,
    status: 'available',
    difficulty: 'easy',
    features: ['Slash commands', 'Direct messages', 'Channel integration', 'Workflows'],
    requirements: ['Slack workspace admin'],
    estimatedTime: '15 minutes'
  },
  {
    id: 'download',
    name: 'Self-Hosted',
    description: 'Download and host yourself',
    icon: <Download className="w-5 h-5" />,
    status: 'available',
    difficulty: 'advanced',
    features: ['Full control', 'Custom hosting', 'Source code', 'No limits'],
    requirements: ['Server infrastructure'],
    estimatedTime: '1-2 hours'
  }
];

export const statusColors = {
  available: 'bg-gray-100 text-gray-800',
  deployed: 'bg-green-100 text-green-800',
  configuring: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800'
};

export const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};