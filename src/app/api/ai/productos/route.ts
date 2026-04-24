import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "claude-haiku-4-5-20251001";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Configurá ANTHROPIC_API_KEY en .env.local" },
      { status: 400 },
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (!messages.length) {
    return NextResponse.json({ error: "messages requerido" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  const system = `Sos el asistente de carga de productos del marketplace "La Salada" (Argentina).
El feriante describe productos en lenguaje natural. Respondé siempre en español rioplatense breve y claro.
Cuando identifiques uno o más productos, al final del mensaje incluí un bloque JSON válido entre marcadores exactos:
<<<PRODUCTOS_JSON>>>
[{"nombre":"...","descripcion":"...","precio":1234.5,"categoria":"...","talle":"...","color":"...","stock":10,"destacado":false}]
<<<FIN_PRODUCTOS_JSON>>>
precio es número en ARS. Si falta un dato, usá null o 0 según corresponda. Si no hay productos, usá [].
No incluyas texto después del bloque de cierre.`;

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    });

    const text =
      msg.content
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("\n") ?? "";

    let parsed: unknown = null;
    const start = text.indexOf("<<<PRODUCTOS_JSON>>>");
    const end = text.indexOf("<<<FIN_PRODUCTOS_JSON>>>");
    if (start !== -1 && end !== -1 && end > start) {
      const raw = text.slice(start + "<<<PRODUCTOS_JSON>>>".length, end).trim();
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }

    return NextResponse.json({ text, productos: parsed });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error de IA";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
