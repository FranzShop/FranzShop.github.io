import OpenAI from "openai";

const allowedOrigin = "https://franzshop.github.io";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

export async function POST(req) {
  const headers = {
    ...corsHeaders(),
    "Content-Type": "application/json"
  };

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY is not configured." }),
      { status: 500, headers }
    );
  }

  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages)
      ? body.messages
      : [];

    const safeMessages = messages
      .filter(
        m =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .slice(-12)
      .map(m => ({
        role: m.role,
        content: m.content.slice(0, 4000)
      }));

    if (!safeMessages.length) {
      return new Response(
        JSON.stringify({ error: "Please enter a message." }),
        { status: 400, headers }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions:
        "You are FranzShop AI Assistant. Answer directly and concisely. " +
        "Understand Cebuano/Bisaya, Tagalog, and English and normally reply " +
        "in the same language used by the user. Do not invent prices, stock, " +
        "orders, payments, or account information.",
      input: safeMessages,
      max_output_tokens: 500
    });

    return new Response(
      JSON.stringify({
        reply:
          response.output_text ||
          "Sorry, I couldn't generate a response right now."
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error(error);
