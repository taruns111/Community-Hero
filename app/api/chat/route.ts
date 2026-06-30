import { NextRequest, NextResponse } from 'next/server';
import { chatWithAssistant, ChatMessage } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const chatHistory: ChatMessage[] = (history || []).map((m: { role: string; text: string }) => ({
      role: m.role as 'user' | 'model',
      text: m.text,
    }));
    const response = await chatWithAssistant(chatHistory, message);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({
      response: "I'm CivicAI Assistant! I can help you report issues, check complaint status, view the map, and learn about rewards. What would you like to know?",
    });
  }
}
