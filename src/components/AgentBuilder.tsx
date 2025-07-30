import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { AgentDesignPreview } from './design/AgentDesignPreview';
import { 
  Bot, 
  Brain, 
  Settings, 
  Database, 
  Rocket, 
  Plus, 
  X, 
  Upload, 
  MessageSquare,
  Zap,
  Shield,
  Globe,
  Clock,
  Target,
  Sparkles,
  FileText,
  Code,
  Palette,
  Eye,
  Paintbrush
} from 'lucide-react';
import { AgentConfig } from '../app/page';

interface AgentBuilderProps {
  agent: AgentConfig;
  onUpdate: (updates: Partial<AgentConfig>) => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

const personalityPresets = [
  { id: 'professional', name: 'Professional', description: 'Formal, business-oriented approach' },
  { id: 'friendly', name: 'Friendly', description: 'Warm, approachable, and conversational' },
  { id: 'expert', name: 'Expert', description: 'Technical, detailed, and authoritative' },
  { id: 'creative', name: 'Creative', description: 'Imaginative, inspiring, and innovative' },
  { id: 'empathetic', name: 'Empathetic', description: 'Understanding, supportive, and caring' },
  { id: 'concise', name: 'Concise', description: 'Brief, direct, and to-the-point' }
];

const skillCategories = [
  {
    name: 'Communication',
    skills: ['Customer Support', 'Sales', 'Content Writing', 'Translation', 'Editing']
  },
  {
    name: 'Technical',
    skills: ['Code Review', 'Debugging', 'API Development', 'System Architecture', 'DevOps']
  },
  {
    name: 'Creative',
    skills: ['Graphic Design', 'Video Editing', 'Music Composition', 'Storytelling', 'Branding']
  },
  {
    name: 'Analytics',
    skills: ['Data Analysis', 'Report Generation', 'Forecasting', 'A/B Testing', 'Metrics']
  },
  {
    name: 'Business',
    skills: ['Strategy', 'Project Management', 'Marketing', 'Finance', 'Operations']
  }
];

const colorPresets = [
  { name: 'Blue', primary: '#3b82f6', secondary: '#e0f2fe', accent: '#0ea5e9' },
  { name: 'Purple', primary: '#8b5cf6', secondary: '#f3e8ff', accent: '#a855f7' },
  { name: 'Green', primary: '#10b981', secondary: '#ecfdf5', accent: '#059669' },
  { name: 'Orange', primary: '#f97316', secondary: '#fff7ed', accent: '#ea580c' },
  { name: 'Pink', primary: '#ec4899', secondary: '#fdf2f8', accent: '#db2777' },
  { name: 'Teal', primary: '#14b8a6', secondary: '#f0fdfa', accent: '#0d9488' }
];

const avatarIcons = ['Bot', 'User', 'Heart', 'Star', 'Zap', 'Shield', 'Crown', 'Diamond'];
const avatarEmojis = ['🤖', '👨‍💼', '👩‍💻', '🎯', '💡', '🚀', '⭐', '💎', '🎨', '📊'];

export function AgentBuilder({ agent, onUpdate, onSave, hasUnsavedChanges }: AgentBuilderProps) {
  const [newSkill, setNewSkill] = useState('');
  const [newExample, setNewExample] = useState({ input: '', output: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePersonalityUpdate = (field: string, value: any) => {
    onUpdate({
      personality: {
        ...agent.personality,
        [field]: value
      }
    });
  };

  const handleCapabilityUpdate = (field: string, value: any) => {
    onUpdate({
      capabilities: {
        ...agent.capabilities,
        [field]: value
      }
    });
  };

  const handleBehaviorUpdate = (field: string, value: any) => {
    onUpdate({
      behavior: {
        ...agent.behavior,
        [field]: value
      }
    });
  };

  const handleDesignUpdate = (section: string, field: string, value: any) => {
    onUpdate({
      design: {
        ...agent.design,
        [section]: {
          ...agent.design[section as keyof typeof agent.design],
          [field]: value
        }
      }
    });
  };

  const addSkill = (skill: string) => {
    if (!agent.capabilities.skills.includes(skill)) {
      handleCapabilityUpdate('skills', [...agent.capabilities.skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    handleCapabilityUpdate('skills', agent.capabilities.skills.filter(s => s !== skill));
  };

  const addExample = () => {
    if (newExample.input && newExample.output) {
      onUpdate({
        training: {
          ...agent.training,
          examples: [...agent.training.examples, newExample]
        }
      });
      setNewExample({ input: '', output: '' });
    }
  };

  const removeExample = (index: number) => {
    onUpdate({
      training: {
        ...agent.training,
        examples: agent.training.examples.filter((_, i) => i !== index)
      }
    });
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    onUpdate({
      design: {
        ...agent.design,
        theme: {
          ...agent.design.theme,
          primaryColor: preset.primary,
          secondaryColor: preset.secondary,
          accentColor: preset.accent
        }
      }
    });
  };

  return (
    <div className="h-full flex">
      {/* Main Configuration Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Brain className="w-8 h-8 text-primary" />
                  Agent Builder
                </h1>
                <p className="text-muted-foreground mt-1">
                  Configure your AI agent's personality, capabilities, behavior, and design
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={hasUnsavedChanges ? "destructive" : "secondary"}>
                  {hasUnsavedChanges ? 'Modified' : 'Saved'}
                </Badge>
                <Button onClick={onSave} disabled={!hasUnsavedChanges} className="gap-2">
                  <Zap className="w-4 h-4" />
                  Save Agent
                </Button>
              </div>
            </div>

            {/* Main Configuration Tabs */}
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic" className="gap-2">
                  <Bot className="w-4 h-4" />
                  Basics
                </TabsTrigger>
                <TabsTrigger value="personality" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Personality
                </TabsTrigger>
                <TabsTrigger value="capabilities" className="gap-2">
                  <Target className="w-4 h-4" />
                  Capabilities
                </TabsTrigger>
                <TabsTrigger value="behavior" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Behavior
                </TabsTrigger>
                <TabsTrigger value="design" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="training" className="gap-2">
                  <Database className="w-4 h-4" />
                  Training
                </TabsTrigger>
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agent-name">Agent Name *</Label>
                        <Input
                          id="agent-name"
                          value={agent.name}
                          onChange={(e) => onUpdate({ name: e.target.value })}
                          placeholder="Enter a memorable name for your agent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agent-category">Category</Label>
                        <Select
                          value={agent.metadata.category}
                          onValueChange={(value) => onUpdate({
                            metadata: { ...agent.metadata, category: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer-service">Customer Service</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="content">Content Creation</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="general">General Purpose</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agent-description">Description *</Label>
                      <Textarea
                        id="agent-description"
                        value={agent.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        placeholder="Describe what your agent does and how it helps users..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {agent.metadata.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {tag}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => {
                                onUpdate({
                                  metadata: {
                                    ...agent.metadata,
                                    tags: agent.metadata.tags.filter((_, i) => i !== index)
                                  }
                                });
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              const newTag = e.currentTarget.value.trim();
                              if (!agent.metadata.tags.includes(newTag)) {
                                onUpdate({
                                  metadata: {
                                    ...agent.metadata,
                                    tags: [...agent.metadata.tags, newTag]
                                  }
                                });
                              }
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Personality Configuration */}
              <TabsContent value="personality" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Personality & Tone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Personality Preset</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {personalityPresets.map((preset) => (
                              <Button
                                key={preset.id}
                                variant={agent.personality.tone === preset.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePersonalityUpdate('tone', preset.id)}
                                className="h-auto p-3 flex flex-col items-start"
                              >
                                <span className="font-medium">{preset.name}</span>
                                <span className="text-xs opacity-70">{preset.description}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="response-length">Response Length</Label>
                          <Select
                            value={agent.personality.responseLength}
                            onValueChange={(value: any) => handlePersonalityUpdate('responseLength', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="concise">Concise (1-2 sentences)</SelectItem>
                              <SelectItem value="detailed">Detailed (3-5 sentences)</SelectItem>
                              <SelectItem value="adaptive">Adaptive (Context-based)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label>Creativity Level: {agent.personality.creativity}%</Label>
                          <Slider
                            value={[agent.personality.creativity]}
                            onValueChange={([value]) => handlePersonalityUpdate('creativity', value)}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Conservative</span>
                            <span>Creative</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Formality Level: {agent.personality.formality}%</Label>
                          <Slider
                            value={[agent.personality.formality]}
                            onValueChange={([value]) => handlePersonalityUpdate('formality', value)}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Casual</span>
                            <span>Formal</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="expertise">Area of Expertise</Label>
                      <Input
                        id="expertise"
                        value={agent.personality.expertise}
                        onChange={(e) => handlePersonalityUpdate('expertise', e.target.value)}
                        placeholder="e.g., Customer service, Technical support, Content creation..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Capabilities */}
              <TabsContent value="capabilities" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Skills & Abilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        {skillCategories.map((category) => (
                          <div key={category.name} className="space-y-2">
                            <Label className="text-sm font-medium">{category.name}</Label>
                            <div className="flex flex-wrap gap-1">
                              {category.skills.map((skill) => (
                                <Button
                                  key={skill}
                                  variant={agent.capabilities.skills.includes(skill) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => 
                                    agent.capabilities.skills.includes(skill) 
                                      ? removeSkill(skill) 
                                      : addSkill(skill)
                                  }
                                  className="h-8 text-xs"
                                >
                                  {skill}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {agent.capabilities.skills.length > 0 && (
                        <div className="space-y-2">
                          <Label>Selected Skills ({agent.capabilities.skills.length})</Label>
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="gap-1">
                                {skill}
                                <X 
                                  className="w-3 h-3 cursor-pointer" 
                                  onClick={() => removeSkill(skill)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Languages & Integrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Supported Languages</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'].map((lang) => (
                            <Button
                              key={lang}
                              variant={agent.capabilities.languages.includes(lang) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const languages = agent.capabilities.languages.includes(lang)
                                  ? agent.capabilities.languages.filter(l => l !== lang)
                                  : [...agent.capabilities.languages, lang];
                                handleCapabilityUpdate('languages', languages);
                              }}
                              className="justify-start"
                            >
                              {lang}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Platform Integrations</Label>
                        <div className="space-y-2">
                          {['Slack', 'Discord', 'Microsoft Teams', 'Telegram', 'WhatsApp', 'Email', 'SMS', 'Webhook'].map((integration) => (
                            <div key={integration} className="flex items-center justify-between">
                              <span className="text-sm">{integration}</span>
                              <Switch
                                checked={agent.capabilities.integrations.includes(integration)}
                                onCheckedChange={(checked) => {
                                  const integrations = checked
                                    ? [...agent.capabilities.integrations, integration]
                                    : agent.capabilities.integrations.filter(i => i !== integration);
                                  handleCapabilityUpdate('integrations', integrations);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Behavior Configuration */}
              <TabsContent value="behavior" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Conversation Flow
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Flow Type</Label>
                        <Select
                          value={agent.behavior.conversationFlow}
                          onValueChange={(value: any) => handleBehaviorUpdate('conversationFlow', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="guided">Guided (Structured questions)</SelectItem>
                            <SelectItem value="open">Open (Free-form conversation)</SelectItem>
                            <SelectItem value="mixed">Mixed (Adaptive approach)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Conversation Memory</Label>
                          <Switch
                            checked={agent.behavior.memory}
                            onCheckedChange={(checked) => handleBehaviorUpdate('memory', checked)}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Remember previous conversations with users
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Safety & Fallbacks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Fallback Behavior</Label>
                        <Select
                          value={agent.behavior.fallbackBehavior}
                          onValueChange={(value) => handleBehaviorUpdate('fallbackBehavior', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apologetic">Apologetic (I don't know, but...)</SelectItem>
                            <SelectItem value="redirect">Redirect (Let me connect you...)</SelectItem>
                            <SelectItem value="suggest">Suggest alternatives</SelectItem>
                            <SelectItem value="escalate">Escalate to human</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Design Configuration */}
              <TabsContent value="design" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Avatar & Branding */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bot className="w-5 h-5" />
                          Avatar & Identity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Avatar Type</Label>
                          <Select
                            value={agent.design.avatar.type}
                            onValueChange={(value) => handleDesignUpdate('avatar', 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="icon">Icon</SelectItem>
                              <SelectItem value="emoji">Emoji</SelectItem>
                              <SelectItem value="initials">Initials</SelectItem>
                              <SelectItem value="image">Custom Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {agent.design.avatar.type === 'icon' && (
                          <div className="space-y-2">
                            <Label>Icon Selection</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {avatarIcons.map((icon) => (
                                <Button
                                  key={icon}
                                  variant={agent.design.avatar.value === icon ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleDesignUpdate('avatar', 'value', icon)}
                                  className="aspect-square p-2"
                                >
                                  {icon}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {agent.design.avatar.type === 'emoji' && (
                          <div className="space-y-2">
                            <Label>Emoji Selection</Label>
                            <div className="grid grid-cols-5 gap-2">
                              {avatarEmojis.map((emoji) => (
                                <Button
                                  key={emoji}
                                  variant={agent.design.avatar.value === emoji ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleDesignUpdate('avatar', 'value', emoji)}
                                  className="aspect-square p-2 text-lg"
                                >
                                  {emoji}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Background Color</Label>
                            <Input
                              type="color"
                              value={agent.design.avatar.backgroundColor}
                              onChange={(e) => handleDesignUpdate('avatar', 'backgroundColor', e.target.value)}
                              className="h-10 w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Text Color</Label>
                            <Input
                              type="color"
                              value={agent.design.avatar.textColor}
                              onChange={(e) => handleDesignUpdate('avatar', 'textColor', e.target.value)}
                              className="h-10 w-full"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Paintbrush className="w-5 h-5" />
                          Color Theme
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Color Presets</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {colorPresets.map((preset) => (
                              <Button
                                key={preset.name}
                                variant="outline"
                                size="sm"
                                onClick={() => applyColorPreset(preset)}
                                className="flex items-center gap-2 p-2"
                              >
                                <div 
                                  className="w-4 h-4 rounded"
                                  style={{ backgroundColor: preset.primary }}
                                />
                                {preset.name}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Primary Color</Label>
                            <Input
                              type="color"
                              value={agent.design.theme.primaryColor}
                              onChange={(e) => handleDesignUpdate('theme', 'primaryColor', e.target.value)}
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Secondary Color</Label>
                            <Input
                              type="color"
                              value={agent.design.theme.secondaryColor}
                              onChange={(e) => handleDesignUpdate('theme', 'secondaryColor', e.target.value)}
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Accent Color</Label>
                            <Input
                              type="color"
                              value={agent.design.theme.accentColor}
                              onChange={(e) => handleDesignUpdate('theme', 'accentColor', e.target.value)}
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Background</Label>
                            <Input
                              type="color"
                              value={agent.design.theme.backgroundColor}
                              onChange={(e) => handleDesignUpdate('theme', 'backgroundColor', e.target.value)}
                              className="h-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Border Radius: {agent.design.theme.borderRadius}px</Label>
                          <Slider
                            value={[agent.design.theme.borderRadius]}
                            onValueChange={([value]) => handleDesignUpdate('theme', 'borderRadius', value)}
                            max={20}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Chat Interface
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Bubble Style</Label>
                          <Select
                            value={agent.design.chatInterface.bubbleStyle}
                            onValueChange={(value) => handleDesignUpdate('chatInterface', 'bubbleStyle', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Font Size</Label>
                            <Select
                              value={agent.design.chatInterface.fontSize}
                              onValueChange={(value) => handleDesignUpdate('chatInterface', 'fontSize', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Spacing</Label>
                            <Select
                              value={agent.design.chatInterface.spacing}
                              onValueChange={(value) => handleDesignUpdate('chatInterface', 'spacing', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="compact">Compact</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="spacious">Spacious</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Widget Greeting</Label>
                          <Input
                            value={agent.design.widget.greeting}
                            onChange={(e) => handleDesignUpdate('widget', 'greeting', e.target.value)}
                            placeholder="Enter greeting message..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Input Placeholder</Label>
                          <Input
                            value={agent.design.widget.placeholder}
                            onChange={(e) => handleDesignUpdate('widget', 'placeholder', e.target.value)}
                            placeholder="Enter placeholder text..."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Live Preview */}
                  <div className="space-y-6">
                    <AgentDesignPreview agent={agent} />
                  </div>
                </div>
              </TabsContent>

              {/* Training Data */}
              <TabsContent value="training" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Training Examples
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Add Training Example</Label>
                        <Textarea
                          placeholder="User input example..."
                          value={newExample.input}
                          onChange={(e) => setNewExample({ ...newExample, input: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expected Response</Label>
                        <Textarea
                          placeholder="How the agent should respond..."
                          value={newExample.output}
                          onChange={(e) => setNewExample({ ...newExample, output: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <Button onClick={addExample} className="w-full gap-2" size="sm">
                        <Plus className="w-4 h-4" />
                        Add Example
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Training Examples ({agent.training.examples.length})</Label>
                      <ScrollArea className="h-40 border rounded-md p-2">
                        <div className="space-y-2">
                          {agent.training.examples.map((example, index) => (
                            <div key={index} className="border rounded p-2 space-y-1">
                              <div className="flex items-start justify-between">
                                <p className="text-xs font-medium">Input:</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExample(index)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">{example.input}</p>
                              <p className="text-xs font-medium">Output:</p>
                              <p className="text-xs text-muted-foreground">{example.output}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}