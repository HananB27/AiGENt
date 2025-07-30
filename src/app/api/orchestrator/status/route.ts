import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { status: 'unavailable', message: 'API key not configured' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { status: 'available', message: 'Orchestrator API is ready' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Orchestrator status check error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
} 