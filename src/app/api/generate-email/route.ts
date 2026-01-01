import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let html = "";

    if (apiKey) {
      // Real AI Generation
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are an expert email copywriter. 
            Generate a professional HTML email body based on the user's request.
Rules:
1. Return ONLY the raw HTML code.Do not include markdown formatting like \`\`\`html.
            2. Use inline CSS for styling (font-family: sans-serif, color: #333, etc.).
            3. Do not include <html>, <head>, or <body> tags. Just the inner content (divs, p, ul, etc.).
            4. Use {{sender_name}}, {{sender_email}}, and {{subject}} variables where appropriate.
            5. Make it look clean and professional.`;

      const result = await model.generateContent([systemPrompt, `User Request: ${prompt}`]);
      const response = await result.response;
      const text = response.text();

      // Clean up any markdown code blocks if the model puts them in
      html = text.replace(/```html/g, '').replace(/```/g, '').trim();

    } else {
      // Mock Fallback (Simulated Latency)
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Using Mock Generator (No API Key found)");

      const lowerPrompt = prompt.toLowerCase();
      if (lowerPrompt.includes("reject") || lowerPrompt.includes("decline")) {
        html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <p>Hi {{sender_name}},</p>
      <p>Thank you for reaching out regarding <strong>{{subject}}</strong>.</p>
      <p>We appreciate your interest, but we are unable to proceed at this time due to current capacity.</p>
      <p>Best regards,</p>
      <p><strong>The Team</strong></p>
    </div>`;
      } else if (lowerPrompt.includes("welcome")) {
        html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4f46e5;">Welcome, {{sender_name}}! 🎉</h2>
      <p>We're thrilled to have you.</p>
      <p>Get started by checking out our docs.</p>
      <p>Cheers,</p>
      <p><strong>The Team</strong></p>
    </div>`;
      } else {
        html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <p>Hi {{sender_name}},</p>
      <p>Thanks for your email about <strong>{{subject}}</strong>.</p>
      <p>Here is the information you requested based on: "${prompt}".</p>
      <p>Best,</p>
      <p><strong>Your Name</strong></p>
    </div>`;
      }
    }

    return NextResponse.json({ html });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
