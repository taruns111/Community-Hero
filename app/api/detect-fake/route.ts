import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { image, location, description } = await req.json();
    // Mock fake detection result
    const authenticityScore = Math.floor(Math.random() * 15) + 85;
    const spamProbability = Math.floor(Math.random() * 10) + 1;
    return NextResponse.json({
      authenticityScore,
      spamProbability,
      isLikelyFake: spamProbability > 20,
      flags: spamProbability > 15 ? ['Image may be edited', 'Location mismatch possible'] : [],
      confidence: Math.floor(Math.random() * 10) + 90,
    });
  } catch {
    return NextResponse.json({ authenticityScore: 90, spamProbability: 5, isLikelyFake: false, flags: [], confidence: 90 });
  }
}
