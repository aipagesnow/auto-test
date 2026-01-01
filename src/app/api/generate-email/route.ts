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
    let useMock = true; // Default to mock, disable if AI succeeds

    if (apiKey) {
      try {
        // Real AI Generation
        const genAI = new GoogleGenerativeAI(apiKey);
        // Try the latest alias for better stability
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const systemPrompt = `You are an expert Email Template Developer.
            Your goal is to generate high-quality, responsive, and visually stunning HTML emails.
            
            STRICT GUIDELINES:
            1.  **Structure**: ALWAYS use a table-based layout. Start with a main container table (width 100%, bg-color #f5f5f5) and an inner content table (width 600px, centered, bg-color white, rounded corners).
            2.  **CSS**: Use ONLY inline CSS. No <style> blocks (except for media queries if absolutely necessary, but prefer inline).
            3.  **Typography**: Use \`font-family: Arial, sans-serif\`. Main text should be #333, 16px, line-height 1.6. Headers should be bold and larger.
            4.  **Content**: 
                - **Header**: Include a colored header section (e.g., #6f4e37 for coffee, or brand color) with a white h1 title.
                - **Body**: Clean padding (e.g., 30px). Use paragraphs <p> with margin-bottom.
                - **Footer**: A subtle grey section with copyright info.
            5.  **Output**: Return ONLY the raw HTML code inside the body tag (inner content). Do not return markdown. Do not return \`\`\`html.
            6.  **Variables**: Use {{sender_name}}, {{sender_email}}, and {{subject}} where logical.
            
            TONE: Professional yet warm. High-end design aesthetic.`;

        const result = await model.generateContent([systemPrompt, `User Request: ${prompt}`]);
        const response = await result.response;
        const text = response.text();

        // Clean up any markdown code blocks if the model puts them in
        html = text.replace(/```html/g, '').replace(/```/g, '').trim();

        if (html) {
          useMock = false; // Success!
        }
      } catch (aiError) {
        console.error("Gemini API Error (falling back to mock):", aiError);
        // Fall through to mock logic
      }
    } else {
      console.log("No API Key found, using mock generator.");
    }

    if (useMock) {
      // Mock Fallback (Simulated Latency)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const lowerPrompt = prompt.toLowerCase();
      // Generate expert-level mock content matching the new system prompt quality
      const headerColor = lowerPrompt.includes("coffee") ? "#6f4e37" : "#4f46e5";
      const brandName = lowerPrompt.includes("coffee") ? "We Love Coffee" : "Your Brand";

      if (lowerPrompt.includes("reject") || lowerPrompt.includes("decline")) {
        html = `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; font-family: Arial, sans-serif; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <tr>
              <td style="background-color:${headerColor}; padding:30px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">${brandName}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin-top:0;">Hi {{sender_name}},</p>
                <p>Thank you so much for reaching out regarding <strong>{{subject}}</strong>.</p>
                <p>We truly appreciate your interest. However, after careful consideration, we are unable to proceed with your request at this time due to our current scheduling capacity.</p>
                <p>We wish you all the best and hope to connect in the future.</p>
                <p style="margin-bottom:0;">Best regards,<br><strong>The Team</strong></p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#fafafa; padding:20px; text-align:center; color:#888888; font-size:12px;">
                &copy; 2026 ${brandName}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
      } else if (lowerPrompt.includes("welcome")) {
        html = `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; font-family: Arial, sans-serif; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <tr>
              <td style="background-color:${headerColor}; padding:40px 30px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:28px;">Welcome to ${brandName}! 🎉</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin-top:0;">Hi {{sender_name}},</p>
                <p>We are absolutely thrilled to have you on board!</p>
                <p>You've just joined a community of passionate people. To get started, we recommend checking out our getting started guide below:</p>
                <p style="text-align:center; margin: 30px 0;">
                   <a href="#" style="background-color:${headerColor}; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:4px; font-weight:bold;">Get Started</a>
                </p>
                <p style="margin-bottom:0;">Cheers,<br><strong>The Team</strong></p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#fafafa; padding:20px; text-align:center; color:#888888; font-size:12px;">
                &copy; 2026 ${brandName}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
      } else {
        html = `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; font-family: Arial, sans-serif; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <tr>
              <td style="background-color:${headerColor}; padding:30px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">Thank You</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin-top:0;">Hi {{sender_name}},</p>
                <p>Thank you for getting in touch about <strong>{{subject}}</strong>.</p>
                <p>This is a custom response tailored to your request: "${prompt}".</p>
                <p>We are reviewing your note and will get back to you shortly.</p>
                <p style="margin-bottom:0;">Best regards,<br><strong>The Team</strong></p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#fafafa; padding:20px; text-align:center; color:#888888; font-size:12px;">
                 &copy; 2026 ${brandName}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
      }
    }

    return NextResponse.json({ html });

  } catch (error) {
    console.error("AI Generation Critical Error:", error);
    // Even in a critical error, return a safe fallback JSON instead of 500
    return NextResponse.json({ html: "<p>Could not generate email at this time. Please try again.</p>" });
  }
}
