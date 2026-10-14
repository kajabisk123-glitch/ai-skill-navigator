import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

interface CourseRequest {
  courseName?: string;
  language?: string;
}

function jsonResponse(
  data: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Only POST requests are supported." },
      405,
    );
  }

  try {
    let body: CourseRequest;

    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        { success: false, error: "Request body must contain valid JSON." },
        400,
      );
    }

    const courseName =
      typeof body.courseName === "string"
        ? body.courseName.trim()
        : "";

    const language = body.language === "Telugu" ? "Telugu" : "English";

    if (!courseName || courseName.length > 100) {
      return jsonResponse(
        {
          success: false,
          error: "Course name must contain between 1 and 100 characters.",
        },
        400,
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return jsonResponse(
        {
          success: false,
          error: "GEMINI_API_KEY is missing from Supabase Edge Function secrets.",
        },
        500,
      );
    }

    const prompt = `
You are an expert course designer for a student learning platform.

Create a practical beginner-friendly course for: ${courseName}
Learner language: ${language}

Return ONLY valid JSON using this structure:
{
  "title": "Course title",
  "modules": [
    {
      "title": "Module title",
      "durationMinutes": 120,
      "aiTools": [
        {
          "name": "Tool name",
          "purpose": "Purpose of the tool",
          "instructions": ["Step 1", "Step 2"]
        }
      ],
      "lessons": [
        {
          "title": "Lesson title",
          "durationMinutes": 30,
          "explanation": "Clear explanation",
          "example": "Practical example",
          "practice": "Practice task",
          "questions": [
            {
              "question": "Question",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "answer": "Exact correct option"
            }
          ]
        }
      ],
      "assignment": {
        "title": "Assignment title",
        "instructions": ["Step 1", "Step 2"],
        "deliverable": "Expected submission"
      }
    }
  ],
  "finalProject": {
    "title": "Project title",
    "description": "Project description",
    "milestones": ["Milestone 1", "Milestone 2"],
    "evaluationCriteria": ["Criterion 1", "Criterion 2"]
  }
}

Requirements:
- Generate 4 modules and 2 lessons per module.
- Include relevant tools for the selected course.
- Include one assignment per module.
- Include realistic duration estimates in minutes.
- Include a practical final project.
- All learner-facing content must use ${language}.
- Never fabricate live class schedules or recording URLs.
- Return JSON only, without Markdown fences.
`;

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errorDetails = await geminiResponse.text();

      console.error(
        "Gemini request failed:",
        geminiResponse.status,
        errorDetails,
      );

      return jsonResponse(
        {
          success: false,
          error: "AI course generation failed. Check API access and quota.",
        },
        502,
      );
    }

    const aiResult: {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    } = await geminiResponse.json();

    const generatedText =
      aiResult.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!generatedText) {
      return jsonResponse(
        { success: false, error: "AI returned an empty response." },
        502,
      );
    }

    let generatedCourse: {
      title: string;
      modules: Array<{
        title: string;
        durationMinutes?: number;
        lessons: unknown[];
        aiTools?: unknown[];
        assignment?: unknown;
      }>;
      finalProject?: unknown;
    };

    try {
      generatedCourse = JSON.parse(generatedText);
    } catch {
      return jsonResponse(
        { success: false, error: "AI returned invalid JSON. Please try again." },
        502,
      );
    }

    if (
      typeof generatedCourse.title !== "string" ||
      !Array.isArray(generatedCourse.modules) ||
      generatedCourse.modules.length === 0 ||
      !generatedCourse.modules.every(
        (module) =>
          typeof module.title === "string" &&
          Array.isArray(module.lessons),
      )
    ) {
      return jsonResponse(
        { success: false, error: "AI returned an invalid course structure." },
        502,
      );
    }

    const totalDurationMinutes = generatedCourse.modules.reduce(
      (total, module) => {
        const duration = module.durationMinutes;
        return total +
          (typeof duration === "number" &&
              Number.isFinite(duration) &&
              duration > 0
            ? duration
            : 0);
      },
      0,
    );

    return jsonResponse({
      success: true,
      courseName,
      language,
      ...generatedCourse,
      totalDurationMinutes,
      generationMode: "gemini",
    });
  } catch (error) {
    console.error("Course generation error:", error);

    return jsonResponse(
      { success: false, error: "Unexpected server error." },
      500,
    );
  }
});