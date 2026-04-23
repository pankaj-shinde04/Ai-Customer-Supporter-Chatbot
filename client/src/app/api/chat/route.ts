import Settings from "@/src/model/settings.model";
import { GoogleGenAI } from "@google/genai/node";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/src/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();
    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "message and ownerId are required" },
        { status: 400 },
      );
    }

    await connectDb();

    const setting = await Settings.findOne({ ownerId });
    if (!setting) {
      return NextResponse.json(
        { message: "chat bot is not configured yet " },
        { status: 404 },
      );
    }

    const knowledge = `
        business name- ${setting.businessName || "not provided"}
        support email- ${setting.supportEmail || "not provided"}
        knowledge base- ${setting.knowledgeBase || "not provided"}
        `;

    const prompt = `You are a professional customer support assistant for this business. Use ONLY the information provided below to answer the customer's question. You may rephrase, summarize, or interpret the information if needed. Do NOT invent new policies, prices, or promises. If the customer's question is completely unrelated to the information, or cannot be reasonably answered from it, reply exactly with: "Please contact support."
        
        Business Information:
        ${knowledge}

        Customer's Question:
        ${message}
        `;

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const resposne = NextResponse.json(res.text);
    resposne.headers.set("Access-Control-Allow-Origin", "*");
    resposne.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    resposne.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return resposne;
  } catch (error) {
    const response = NextResponse.json(
      { message: "Failed to generate AI response" },
      { status: 500 },
    );

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }
}

export  const OPTIONS = async () => {
   return NextResponse.json(null,{
    status:201,
    headers:{
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods":"POST, OPTIONS",
        "Access-Control-Allow-Headers":"Content-Type",
    }
   })

}
