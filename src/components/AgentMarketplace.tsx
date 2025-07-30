import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  TrendingUp, 
  Clock, 
  Users,
  Sparkles,
  Bot,
  MessageSquare,
  Code,
  PenTool,
  BarChart3,
  Heart,
  Briefcase,
  GraduationCap,
  ShoppingCart,
  Headphones,
  Shield,
  Zap,
  Crown,
  Gift
} from 'lucide-react';
import { AgentTemplate, AgentConfig } from '../app/page';

interface AgentMarketplaceProps {
  onLoadTemplate: (template: AgentTemplate) => void;
  savedAgents: AgentConfig[];
  onLoadAgent: (agent: AgentConfig) => void;
}

const agentTemplates: AgentTemplate[] = [
  {
    id: '1',
    name: 'Enterprise Support Agent',
    description: 'Advanced customer support agent with multi-language support and enterprise integrations',
    category: 'Customer Service',
    difficulty: 'advanced',
    estimatedTime: '45 min',
    features: ['24/7 Support', 'Multi-language', 'CRM Integration', 'Escalation Management'],
    pricing: 'enterprise',
    rating: 4.9,
    downloads: 2847,
    preview: 'Hello! I\'m your enterprise support agent. I can help with technical issues, billing questions, and account management across multiple languages.',
    icon: <Headphones className="w-5 h-5" />,
    gradient: 'from-blue-500 to-indigo-600',
    config: {
      personality: {
        tone: 'professional',
        style: 'helpful',
        expertise: 'customer service',
        responseLength: 'detailed',
        creativity: 30,
        formality: 80
      },
      capabilities: {
        skills: ['Customer Support', 'Technical Troubleshooting', 'Billing Support', 'Account Management'],
        languages: ['English', 'Spanish', 'French', 'German'],
        integrations: ['Salesforce', 'Zendesk', 'Slack'],
        knowledgeBases: []
      }
    }
  },
  {
    id: '2',
    name: 'AI Code Reviewer',
    description: 'Expert code review agent with security analysis and best practice recommendations',
    category: 'Development',
    difficulty: 'advanced',
    estimatedTime: '60 min',
    features: ['Security Analysis', 'Performance Review', 'Best Practices', 'Multi-language Support'],
    pricing: 'premium',
    rating: 4.8,
    downloads: 1923,
    preview: 'I\'ll review your code for security vulnerabilities, performance issues, and adherence to best practices.',
    icon: <Code className="w-5 h-5" />,
    gradient: 'from-green-500 to-emerald-600',
    config: {
      personality: {
        tone: 'expert',
        style: 'technical',
        expertise: 'software development',
        responseLength: 'detailed',
        creativity: 40,
        formality: 70
      }
    }
  },
  {
    id: '3',
    name: 'Content Marketing Assistant',
    description: 'Creative content generation agent for blogs, social media, and marketing campaigns',
    category: 'Marketing',
    difficulty: 'intermediate',
    estimatedTime: '30 min',
    features: ['SEO Optimization', 'Brand Voice', 'Multi-platform', 'Analytics Integration'],
    pricing: 'premium',
    rating: 4.7,
    downloads: 3456,
    preview: 'I create engaging content that drives results. From blog posts to social media campaigns, I\'ve got your content covered.',
    icon: <PenTool className="w-5 h-5" />,
    gradient: 'from-purple-500 to-pink-600',
    config: {}
  },
  {
    id: '4',
    name: 'Data Analytics Consultant',
    description: 'Advanced analytics agent for data interpretation and business insights',
    category: 'Analytics',
    difficulty: 'advanced',
    estimatedTime: '50 min',
    features: ['Data Visualization', 'Predictive Analysis', 'Report Generation', 'KPI Tracking'],
    pricing: 'enterprise',
    rating: 4.9,
    downloads: 1678,
    preview: 'I transform your data into actionable insights with advanced analytics and clear visualizations.',
    icon: <BarChart3 className="w-5 h-5" />,
    gradient: 'from-orange-500 to-red-600',
    config: {}
  },
  {
    id: '5',
    name: 'Personal Wellness Guide',
    description: 'Supportive wellness coach for mental health, fitness, and lifestyle guidance',
    category: 'Health & Wellness',
    difficulty: 'beginner',
    estimatedTime: '20 min',
    features: ['Mental Health Support', 'Fitness Tracking', 'Nutrition Guidance', 'Goal Setting'],
    pricing: 'free',
    rating: 4.6,
    downloads: 5234,
    preview: 'I\'m here to support your wellness journey with personalized guidance for mind, body, and lifestyle.',
    icon: <Heart className="w-5 h-5" />,
    gradient: 'from-pink-500 to-rose-600',
    config: {}
  },
  {
    id: '6',
    name: 'Business Strategy Advisor',
    description: 'Executive-level business strategy and decision-making support agent',
    category: 'Business',
    difficulty: 'advanced',
    estimatedTime: '55 min',
    features: ['Strategic Planning', 'Market Analysis', 'Financial Modeling', 'Risk Assessment'],
    pricing: 'enterprise',
    rating: 4.8,
    downloads: 987,
    preview: 'I provide executive-level strategic insights to help you make informed business decisions.',
    icon: <Briefcase className="w-5 h-5" />,
    gradient: 'from-indigo-500 to-blue-600',
    config: {}
  },
  {
    id: '7',
    name: 'Educational Tutor',
    description: 'Adaptive learning assistant for students and educators across all subjects',
    category: 'Education',
    difficulty: 'intermediate',
    estimatedTime: '35 min',
    features: ['Adaptive Learning', 'Multi-subject', 'Progress Tracking', 'Study Planning'],
    pricing: 'free',
    rating: 4.7,
    downloads: 4512,
    preview: 'I adapt to your learning style and help you master any subject with personalized tutoring.',
    icon: <GraduationCap className="w-5 h-5" />,
    gradient: 'from-teal-500 to-cyan-600',
    config: {}
  },
  {
    id: '8',
    name: 'E-commerce Sales Assistant',
    description: 'Advanced sales agent with product recommendations and conversion optimization',
    category: 'E-commerce',
    difficulty: 'intermediate',
    estimatedTime: '40 min',
    features: ['Product Recommendations', 'Inventory Integration', 'Cart Recovery', 'Upselling'],
    pricing: 'premium',
    rating: 4.5,
    downloads: 2134,
    preview: 'I help customers find the perfect products and guide them through seamless purchase experiences.',
    icon: <ShoppingCart className="w-5 h-5" />,
    gradient: 'from-red-500 to-orange-600',
    config: {}
  }
];

const categories = [
  'All Categories',
  'Customer Service',
  'Development',
  'Marketing',
  'Analytics',
  'Health & Wellness',
  'Business',
  'Education',
  'E-commerce'
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

const pricingIcons = {
  free: <Gift className="w-4 h-4" />,
  premium: <Sparkles className="w-4 h-4" />,
  enterprise: <Crown className="w-4 h-4" />
};

export function AgentMarketplace({ onLoadTemplate, savedAgents, onLoadAgent }: AgentMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    let filtered = agentTemplates;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Sort templates
    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => b.downloads - a.downloads);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'difficulty':
        return filtered.sort((a, b) => {
          const order = { beginner: 0, intermediate: 1, advanced: 2 };
          return order[a.difficulty] - order[b.difficulty];
        });
      default:
        return filtered;
    }
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                Agent Marketplace
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover pre-built agents and templates to accelerate your development
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                {agentTemplates.length} Templates
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Users className="w-3 h-3" />
                {agentTemplates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()} Downloads
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates, features, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Categories */}
          <div className="flex gap-2">
            {categories.slice(1, 6).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="templates" className="h-full flex flex-col">
          <div className="border-b px-6">
            <TabsList>
              <TabsTrigger value="templates" className="gap-2">
                <Bot className="w-4 h-4" />
                Templates ({filteredTemplates.length})
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <Clock className="w-4 h-4" />
                My Agents ({savedAgents.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="templates" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="h-full cursor-pointer group hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center text-white`}>
                              {template.icon}
                            </div>
                            <div className="flex items-center gap-1">
                              {pricingIcons[template.pricing]}
                              <Badge
                                variant={template.pricing === 'free' ? 'secondary' : 'default'}
                                className="capitalize text-xs"
                              >
                                {template.pricing}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mb-2">
                              {template.description}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${difficultyColors[template.difficulty]}`}
                              >
                                {template.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {template.estimatedTime}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {template.features.slice(0, 3).map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {template.features.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{template.features.length - 3} more
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium">{template.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Download className="w-3 h-3" />
                                  {template.downloads.toLocaleString()}
                                </div>
                              </div>
                              
                              <div className="flex gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedTemplate(template)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center text-white`}>
                                          {template.icon}
                                        </div>
                                        {template.name}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <p className="text-muted-foreground">{template.description}</p>
                                      
                                      <div className="space-y-2">
                                        <h4 className="font-medium">Preview Response:</h4>
                                        <div className="bg-muted p-3 rounded-lg text-sm">
                                          {template.preview}
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <h4 className="font-medium">Features:</h4>
                                        <div className="flex flex-wrap gap-1">
                                          {template.features.map((feature) => (
                                            <Badge key={feature} variant="secondary">
                                              {feature}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          onClick={() => {
                                            onLoadTemplate(template);
                                            setSelectedTemplate(null);
                                          }}
                                          className="gap-2"
                                        >
                                          <Zap className="w-4 h-4" />
                                          Use Template
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button
                                  size="sm"
                                  onClick={() => onLoadTemplate(template)}
                                  className="gap-2"
                                >
                                  <Zap className="w-4 h-4" />
                                  Use
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="saved" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <div className="max-w-6xl mx-auto">
                  {savedAgents.length === 0 ? (
                    <div className="text-center py-12">
                      <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No saved agents yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first agent or use a template to get started
                      </p>
                      <Button onClick={() => window.location.href = '#builder'}>
                        Create Agent
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedAgents.map((agent) => (
                        <Card key={agent.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {agent.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <CardTitle className="text-base">{agent.name}</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  {agent.metadata.category}
                                </p>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {agent.metadata.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                              {agent.description || 'No description provided'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">
                                Updated {agent.metadata.updated.toLocaleDateString()}
                              </div>
                              <Button size="sm" onClick={() => onLoadAgent(agent)}>
                                Open
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}