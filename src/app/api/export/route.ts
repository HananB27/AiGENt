import { NextRequest, NextResponse } from 'next/server';
import { ExportService } from '../../../services/exportService';

const exportService = new ExportService();

export async function POST(request: NextRequest) {
  try {
    const { agent, exportConfig } = await request.json();
    
    if (!agent) {
      return NextResponse.json({ error: 'Agent configuration is required' }, { status: 400 });
    }

    if (!exportConfig) {
      return NextResponse.json({ error: 'Export configuration is required' }, { status: 400 });
    }

    // Generate the exported agent
    const exportedAgent = await exportService.exportAgent(agent, exportConfig);
    
    return NextResponse.json({
      success: true,
      exportedAgent,
      message: exportedAgent.deploymentMessage || 'Agent exported successfully'
    });
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json({ 
      error: 'Failed to export agent',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const exportFormats = exportService.getExportFormats();
    const deploymentPlatforms = exportService.getDeploymentPlatforms();
    
    return NextResponse.json({
      exportFormats,
      deploymentPlatforms
    });
  } catch (error) {
    console.error('Export config API error:', error);
    return NextResponse.json({ error: 'Failed to get export configuration' }, { status: 500 });
  }
} 