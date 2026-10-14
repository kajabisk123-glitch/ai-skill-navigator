import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )
    }

    const { question, courseName, lessonTitle, language, lessonExplanation } =
      await req.json()

    if (!question || typeof question !== "string" || !question.trim()) {
      return new Response(
        JSON.stringify({ error: "Please enter your question." }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY")

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.")
    }

    const prompt = `
You are a friendly AI teacher in an educational application.

Course: ${String(courseName || "General learning").slice(0, 200)}
Lesson: ${String(lessonTitle || "Current lesson").slice(0, 200)}
Lesson explanation:
${String(lessonExplanation || "").slice(0, 5000)}

Student's question:
${question.trim().slice(0, 3000)}

Answer in ${language === "Telugu" ? "Telugu, using simple language" : "simple English"}.
Explain step by step when necessary.
Use a small example if it helps.
Stay focused on the student's question.
`

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("Gemini error:", data)
      throw new Error("AI could not answer right now. Please try again.")
    }

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("\n")
        .trim()

    if (!answer) {
      throw new Error("No answer was returned. Please try again.")
    }

    return new Response(JSON.stringify({ answer }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong."

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    })
  }
})