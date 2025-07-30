import { NextRequest, NextResponse } from 'next/server';
import { ExportService } from '../../../../services/exportService';

const exportService = new ExportService();

export async function POST(request: NextRequest) {
  try {
    const { exportedAgent } = await request.json();
    
    if (!exportedAgent) {
      return NextResponse.json({ error: 'Exported agent is required' }, { status: 400 });
    }

    // Generate the zip file
    const zipBlob = await exportService.downloadExport(exportedAgent);
    
    // Return the zip file as a response
    return new NextResponse(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${exportedAgent.name.toLowerCase().replace(/\s+/g, '-')}.zip"`
      }
    });
  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json({ 
      error: 'Failed to download agent',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 