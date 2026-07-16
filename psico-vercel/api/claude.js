// Servidor mínimo para la IA · App Psicoeducativa (Vercel Serverless Function)
// La llave de Anthropic se guarda como variable de entorno ANTHROPIC_API_KEY
// en Vercel (Project → Settings → Environment Variables). Nunca en el código.
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
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages
      })
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: (data && data.error && data.error.message) || "Error de la IA." });
      return;
    }
    const text = (data.content || []).map(function (c) { return c.text || ""; }).join("");
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message || "Error inesperado." });
  }
}
