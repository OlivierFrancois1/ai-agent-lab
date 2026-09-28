import OpenAI from "openai";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof body.message !== "string" ||
    body.message.trim().length === 0
  ) {
    return Response.json({ error: "Please provide a non-empty message." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "The LLM is not configured on the server yet." }, { status: 503 });
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: body.message.trim(),
    });

    return Response.json({ answer: response.output_text });
  } catch {
    return Response.json({ error: "The LLM request could not be completed. Please try again." }, { status: 502 });
  }
}
