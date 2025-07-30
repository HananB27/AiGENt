import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Bot, Send, User } from 'lucide-react';
import { AgentConfig } from '../../app/page';

interface AgentDesignPreviewProps {
  agent: AgentConfig;
}

export function AgentDesignPreview({ agent }: AgentDesignPreviewProps) {
  const { design } = agent;
  
  const getAvatarContent = () => {
    switch (design.avatar.type) {
      case 'emoji':
        return design.avatar.value;
      case 'initials':
        return agent.name.substring(0, 2).toUpperCase();
      case 'icon':
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getFontSizeClass = () => {
    switch (design.chatInterface.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-base';
      case 'medium':
      default: return 'text-sm';
    }
  };

  const getSpacingClass = () => {
    switch (design.chatInterface.spacing) {
      case 'compact': return 'space-y-2';
      case 'spacious': return 'space-y-6';
      case 'normal':
      default: return 'space-y-4';
    }
  };

  const getBubbleStyle = () => {
    switch (design.chatInterface.bubbleStyle) {
      case 'square': return 'rounded-none';
      case 'minimal': return 'rounded border-l-4';
      case 'rounded':
      default: return `rounded-${design.theme.borderRadius}px`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Widget Preview */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Chat Widget Preview</h4>
          <div 
            className="relative mx-auto border-2 rounded-lg overflow-hidden shadow-lg"
            style={{ 
              width: '350px', 
              height: '500px',
              backgroundColor: design.theme.backgroundColor,
              borderColor: design.theme.primaryColor
            }}
          >
            {/* Widget Header */}
            <div 
              className="p-4 border-b flex items-center gap-3"
              style={{ 
                backgroundColor: design.theme.primaryColor,
                color: design.theme.backgroundColor
              }}
            >
              <Avatar 
                className="w-10 h-10"
                style={{ 
                  backgroundColor: design.avatar.backgroundColor,
                  color: design.avatar.textColor
                }}
              >
                <AvatarFallback 
                  style={{ 
                    backgroundColor: design.avatar.backgroundColor,
                    color: design.avatar.textColor
                  }}
                >
                  {getAvatarContent()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{agent.name}</p>
                <p className="text-xs opacity-80">
                  {design.branding.tagline || 'AI Assistant'}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              className={`flex-1 p-4 ${getSpacingClass()}`}
              style={{ 
                color: design.theme.textColor,
                fontFamily: design.chatInterface.fontFamily,
                height: '350px',
                overflowY: 'auto'
              }}
            >
              {/* Agent Message */}
              <div className="flex gap-3">
                <Avatar 
                  className="w-8 h-8"
                  style={{ 
                    backgroundColor: design.avatar.backgroundColor,
                    color: design.avatar.textColor
                  }}
                >
                  <AvatarFallback 
                    style={{ 
                      backgroundColor: design.avatar.backgroundColor,
                      color: design.avatar.textColor
                    }}
                  >
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={`p-3 max-w-[80%] ${getBubbleStyle()} ${getFontSizeClass()}`}
                  style={{ 
                    backgroundColor: design.chatInterface.agentBubbleColor,
                    color: design.theme.textColor
                  }}
                >
                  {design.widget.greeting}
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 justify-end">
                <div 
                  className={`p-3 max-w-[80%] ${getBubbleStyle()} ${getFontSizeClass()}`}
                  style={{ 
                    backgroundColor: design.chatInterface.userBubbleColor,
                    color: design.theme.backgroundColor
                  }}
                >
                  Hello! I need help with my account.
                </div>
                <Avatar className="w-8 h-8 bg-gray-200">
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Agent Response */}
              <div className="flex gap-3">
                <Avatar 
                  className="w-8 h-8"
                  style={{ 
                    backgroundColor: design.avatar.backgroundColor,
                    color: design.avatar.textColor
                  }}
                >
                  <AvatarFallback 
                    style={{ 
                      backgroundColor: design.avatar.backgroundColor,
                      color: design.avatar.textColor
                    }}
                  >
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={`p-3 max-w-[80%] ${getBubbleStyle()} ${getFontSizeClass()}`}
                  style={{ 
                    backgroundColor: design.chatInterface.agentBubbleColor,
                    color: design.theme.textColor
                  }}
                >
                  I'd be happy to help you with your account! Can you tell me more about what you need assistance with?
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div 
              className="p-4 border-t"
              style={{ borderColor: design.theme.secondaryColor }}
            >
              <div className="flex gap-2">
                <Input
                  placeholder={design.widget.placeholder}
                  className={`flex-1 ${getFontSizeClass()}`}
                  style={{ 
                    fontFamily: design.chatInterface.fontFamily,
                    borderColor: design.theme.secondaryColor
                  }}
                />
                <Button 
                  size="sm"
                  style={{ 
                    backgroundColor: design.theme.primaryColor,
                    color: design.theme.backgroundColor
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Company Branding */}
            {design.widget.showCompanyBranding && design.branding.companyName && (
              <div 
                className="px-4 py-2 text-center border-t"
                style={{ 
                  backgroundColor: design.theme.secondaryColor,
                  borderColor: design.theme.primaryColor
                }}
              >
                <p className="text-xs" style={{ color: design.theme.textColor }}>
                  Powered by {design.branding.companyName}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Avatar Preview */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Avatar Preview</h4>
          <div className="flex items-center gap-4">
            <Avatar 
              className="w-16 h-16"
              style={{ 
                backgroundColor: design.avatar.backgroundColor,
                color: design.avatar.textColor
              }}
            >
              <AvatarFallback 
                style={{ 
                  backgroundColor: design.avatar.backgroundColor,
                  color: design.avatar.textColor
                }}
              >
                {getAvatarContent()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{agent.name}</p>
              <p className="text-sm text-muted-foreground">
                {design.avatar.type} avatar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Color Palette</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: design.theme.primaryColor }}
              />
              <span className="text-sm">Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: design.theme.secondaryColor }}
              />
              <span className="text-sm">Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: design.theme.accentColor }}
              />
              <span className="text-sm">Accent</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: design.theme.backgroundColor }}
              />
              <span className="text-sm">Background</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 