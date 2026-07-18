// Servidor de IA · App Psicoeducativa (Vercel Serverless Function)
const MODELOS = [
  "claude-sonnet-4-5",
  "claude-sonnet-4-20250514",
  "claude-3-7-sonnet-latest",
  "claude-3-5-sonnet-latest",
  "claude-3-5-haiku-latest"
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Usa POST." });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: "Falta configurar ANTHROPIC_API_KEY en Vercel." });
    return;
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const maxTokens = body.max_tokens || 2000;
    const candidatos = body.model ? [body.model, ...MODELOS] : MODELOS;

    let ultimoError = "Error de la IA.";
    let ultimoStatus = 500;
    for (const model of candidatos) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({ model, max_tokens: maxTokens, messages })
      });
      const data = await r.json();
      if (r.ok) {
        const text = (data.content || []).map(function (c) { return c.text || ""; }).join("");
        res.status(200).json({ text, model });
        return;
      }
      ultimoStatus = r.status;
      ultimoError = (data && data.error && data.error.message) || ("HTTP " + r.status);
      if (r.status !== 404) break;
    }
    res.status(ultimoStatus).json({ error: ultimoError });
  } catch (e) {
    res.status(500).json({ error: e.message || "Error inesperado." });
  }
}
