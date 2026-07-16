/**
 * Puente de IA · App Psicoeducativa (Rumbo)
 * ─────────────────────────────────────────────────────────────────
 * Las pantallas llaman a window.claude.complete(...).
 *   • En la vista previa de Claude → usa la IA nativa (no toca nada).
 *   • En el sitio publicado (Vercel) → llama a /api/claude, un pequeño
 *     servidor que guarda la llave de Anthropic en secreto (variable
 *     de entorno ANTHROPIC_API_KEY). La llave NUNCA viaja al navegador.
 */
(function () {
  var native = (window.claude && typeof window.claude.complete === "function") ? window.claude : null;
  function toMessages(arg) {
    if (typeof arg === "string") return [{ role: "user", content: arg }];
    if (arg && Array.isArray(arg.messages)) return arg.messages;
    if (arg && arg.prompt) return [{ role: "user", content: arg.prompt }];
    try { return [{ role: "user", content: JSON.stringify(arg) }]; }
    catch (e) { return [{ role: "user", content: String(arg) }]; }
  }
  async function server(arg) {
    var res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: toMessages(arg) })
    });
    var data = null;
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error((data && data.error) || ("HTTP " + res.status));
    return (data && data.text) || "";
  }
  window.claude = {
    complete: async function (arg) {
      if (native) return native.complete(arg);
      return server(arg);
    }
  };
})();
