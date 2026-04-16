import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

const systemPrompt = `You are a senior technical instructor at Misrak Polytechnic College. Your mission is to explain complex English technical manuals (IT, Automotive, Construction) in simple, supportive, and practical Amharic. Use formatting like bullet points and bold text to make it easy to read in a lab setting.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, imageBase64 } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build the content array with text and optional image
    const content: Array<{ type: string; text?: string; source?: object }> = [];

    // Add image if provided
    if (imageBase64) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/jpeg',
          data: imageBase64,
        },
      });
    }

    // Add text message
    content.push({
      type: 'text',
      text: message,
    });

    // Create the streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'HTTP-Referer': 'https://ibexai.local',
              'X-Title': 'Ibex AI - Amharic Technical Tutor',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemma-3-12b-it:free',
              messages: [
                {
                  role: 'system',
                  content: systemPrompt,
                },
                {
                  role: 'user',
                  content: content,
                },
              ],
              stream: true,
            }),
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body');
          }

          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  // Skip parsing errors for malformed chunks
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          controller.error(new Error(errorMessage));
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
