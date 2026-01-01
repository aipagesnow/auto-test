
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // TODO: Integrate with real AI provider (OpenAI/Gemini)
        // For now, we use a sophisticated mock generator for demonstration

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency

        let html = "";

        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes("reject") || lowerPrompt.includes("decline")) {
            html = `
<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <p>Hi {{sender_name}},</p>
  <p>Thank you for reaching out to us regarding <strong>{{subject}}</strong>.</p>
  <p>We appreciate your interest, but unfortunately, we are unable to proceed with your request at this time. We received a high volume of inquiries and had to make some difficult decisions.</p>
  <p>We will keep your information on file for future opportunities.</p>
  <p>Best regards,</p>
  <p><strong>The Team</strong></p>
</div>`;
        } else if (lowerPrompt.includes("welcome") || lowerPrompt.includes("onboard")) {
            html = `
<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #4f46e5;">Welcome to the Community, {{sender_name}}! 🎉</h2>
  <p>We are thrilled to have you on board.</p>
  <p>Here are a few next steps to get you started:</p>
  <ul>
    <li>Complete your profile</li>
    <li>Check out our documentation</li>
    <li>Join our Slack community</li>
  </ul>
  <p>If you have any questions, feel free to reply to this email.</p>
  <p>Cheers,</p>
  <p><strong>The Team</strong></p>
</div>`;
        } else if (lowerPrompt.includes("support") || lowerPrompt.includes("help")) {
            html = `
<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <p>Hi {{sender_name}},</p>
  <p>Thanks for contacting support. We have received your ticket regarding: <strong>{{subject}}</strong>.</p>
  <p>Our team is reviewing your issue and will get back to you within 24 hours.</p>
  <p>In the meantime, you might find our <a href="#" style="color: #4f46e5;">Help Center</a> useful.</p>
  <p>Thanks for your patience!</p>
  <p><strong>Customer Support</strong></p>
</div>`;
        } else if (lowerPrompt.includes("meeting") || lowerPrompt.includes("schedule")) {
            html = `
<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <p>Hi {{sender_name}},</p>
  <p>Thanks for the meeting request.</p>
  <p>I'd be happy to chat about {{subject}}. Please feel free to book a time that works for you using my calendar link below:</p>
  <p><a href="#" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Book a Meeting</a></p>
  <p>Looking forward to it!</p>
  <p>Best,</p>
  <p><strong>Your Name</strong></p>
</div>`;
        } else {
            // Generic Fallback
            html = `
<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <p>Hi {{sender_name}},</p>
  <p>Thank you for your email about <strong>{{subject}}</strong>.</p>
  <p>I wanted to get back to you personally tailored to your request. [ ... AI continues based on: "${prompt}" ... ]</p>
  <p>Please let me know if you have any further questions.</p>
  <p>Best,</p>
  <p><strong>Your Name</strong></p>
</div>`;
        }

        return NextResponse.json({ html });

    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
