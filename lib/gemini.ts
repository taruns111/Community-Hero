// lib/gemini.ts - Google Gemini API client for CivicAI

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export interface IssueAnalysisResult {
  category: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  department: string;
  priority: number;
  confidence: number;
  detectedObjects: string[];
  estimatedResolution: string;
  authenticityScore: number;
  spamProbability: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function analyzeIssueImage(base64Image: string, mimeType: string = 'image/jpeg'): Promise<IssueAnalysisResult> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    // Return mock response if no API key
    return getMockAnalysis();
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Image,
                },
              },
              {
                text: `You are an AI assistant for a civic issue reporting platform. Analyze this image and provide a structured JSON response with the following fields:
- category: one of [Pothole, Garbage, "Water Leakage", "Street Light", Drainage, "Road Damage", "Illegal Dumping", "Fallen Tree", "Traffic Signal", Sewage, Graffiti, "Noise Pollution", Other]
- title: a concise issue title (max 10 words)
- description: detailed issue description (2-3 sentences)
- severity: one of [Low, Medium, High, Critical]
- department: responsible government department
- priority: number 1-4 (1=highest)
- confidence: percentage 0-100
- detectedObjects: array of objects detected in image
- estimatedResolution: estimated time to resolve
- authenticityScore: percentage 0-100 (how authentic the image appears)
- spamProbability: percentage 0-100

Respond ONLY with valid JSON, no markdown formatting.`,
              },
            ],
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean JSON from potential markdown
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(jsonStr);
    return result as IssueAnalysisResult;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getMockAnalysis();
  }
}

export async function chatWithAssistant(messages: ChatMessage[], userMessage: string): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return getMockChatResponse(userMessage);
  }

  try {
    const systemContext = `You are CivicAI Assistant, an intelligent helper for a community issue reporting platform called CivicAI. 
You help citizens report infrastructure issues, check complaint status, and navigate the platform. 
You have knowledge about common civic issues like potholes, garbage, water leakage, street lights, drainage problems, etc.
Be helpful, concise, and friendly. When relevant, suggest using the platform features.
Current platform stats: 1,247 issues reported, 89% resolution rate, 12,450 active citizens.`;

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemContext }] },
          contents: [
            ...history,
            { role: 'user', parts: [{ text: userMessage }] },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getMockChatResponse(userMessage);
  } catch (error) {
    console.error('Gemini chat error:', error);
    return getMockChatResponse(userMessage);
  }
}

function getMockAnalysis(): IssueAnalysisResult {
  const categories = ['Pothole', 'Garbage', 'Water Leakage', 'Street Light', 'Drainage'];
  const departments = ['Road Maintenance', 'Solid Waste Management', 'Water Supply', 'Electrical Department', 'Storm Water Drainage'];
  const idx = Math.floor(Math.random() * categories.length);
  return {
    category: categories[idx],
    title: `${categories[idx]} Issue Detected - Immediate Attention Required`,
    description: `AI analysis has detected a ${categories[idx].toLowerCase()} issue in the uploaded image. The affected area shows clear signs of infrastructure damage requiring prompt municipal intervention. Citizens in the vicinity may be affected by this issue.`,
    severity: ['Medium', 'High', 'Critical'][Math.floor(Math.random() * 3)] as 'Medium' | 'High' | 'Critical',
    department: departments[idx],
    priority: Math.floor(Math.random() * 3) + 1,
    confidence: Math.floor(Math.random() * 15) + 85,
    detectedObjects: [categories[idx].toLowerCase(), 'road surface', 'infrastructure'],
    estimatedResolution: ['1-2 days', '3-5 days', '1 week'][Math.floor(Math.random() * 3)],
    authenticityScore: Math.floor(Math.random() * 10) + 90,
    spamProbability: Math.floor(Math.random() * 8),
  };
}

function getMockChatResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('report') || msg.includes('how')) {
    return `To report an issue on CivicAI, follow these simple steps:\n\n1. 📸 Click **"Report Issue"** in the navigation\n2. 🖼️ Upload a photo or video of the problem\n3. 🤖 Our AI will automatically analyze and categorize it\n4. 📍 Confirm your location on the map\n5. ✅ Review and submit!\n\nYour report will be reviewed by the community and assigned to the relevant department within hours.`;
  }
  if (msg.includes('status') || msg.includes('complaint') || msg.includes('my report')) {
    return `You can track your complaint status in your **Citizen Dashboard** → "My Reports". Each issue goes through these stages:\n\n🔵 Reported → ✅ Verified → 📋 Assigned → 🔨 In Progress → ✅ Completed\n\nYou'll receive notifications at each stage. Your reports show an average resolution time of **3.2 days**!`;
  }
  if (msg.includes('nearby') || msg.includes('area') || msg.includes('location')) {
    return `To view nearby issues, go to the **🗺️ Map** page! You'll see all reported issues as color-coded markers:\n\n🔴 Pending • 🟡 In Progress • 🟢 Resolved\n\nYou can filter by category, severity, or date range. There are currently **47 active issues** within 2km of your area.`;
  }
  if (msg.includes('water') || msg.includes('leakage') || msg.includes('pipe')) {
    return `Water leakage issues are handled by the **Water Supply Department** (BMC). Based on our data:\n\n- 🚨 Critical leaks: Resolved within **4-6 hours**\n- ⚠️ High severity: Resolved within **1-2 days**\n- ℹ️ Minor leaks: Resolved within **3-5 days**\n\nThere are currently **15 water-related issues** active in your city. Want me to show you the nearest ones?`;
  }
  if (msg.includes('pothole') || msg.includes('road')) {
    return `Potholes are one of the most reported issues on CivicAI! 🛣️\n\nCurrently: **142 pothole reports** citywide\n- 48 Pending review\n- 67 In Progress\n- 27 Resolved this week\n\nThe **Road Maintenance Department** handles these. Average resolution: **3.2 days**. Report yours now — every report counts!`;
  }
  if (msg.includes('point') || msg.includes('badge') || msg.includes('reward') || msg.includes('leaderboard')) {
    return `CivicAI rewards active citizens! 🏆\n\n**How to earn points:**\n- 📸 Report an issue: +50 pts\n- ✅ Verify a report: +20 pts\n- 💬 Helpful comment: +10 pts\n- 🎯 Issue resolved: +100 pts\n\n**Badges available:** First Reporter, Community Hero, Problem Solver, Neighborhood Guardian, Top Contributor, Monthly Champion\n\nCheck the **Leaderboard** to see your rank!`;
  }
  
  return `I'm CivicAI Assistant! 🤖 I can help you with:\n\n- 📍 **Reporting** civic issues (potholes, garbage, water leaks, etc.)\n- 🔍 **Finding** nearby complaints on the map\n- 📊 **Tracking** your complaint status\n- 🏆 **Learning** about rewards and badges\n- 🏛️ **Identifying** which department handles your issue\n\nWhat would you like to know?`;
}
