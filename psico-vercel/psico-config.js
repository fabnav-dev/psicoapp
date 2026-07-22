// ─── Configuración Supabase · App Psicoeducativa ───────────────────────────
// Proyecto NUEVO y separado solo para esta app.
// La clave "anon" es pública (segura para el navegador). La service_role NUNCA va aquí.
window.PSICO_SUPA = {
  url:  "https://muzqzsjssjdtlpwixyjb.supabase.co",
  anon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11enF6c2pzc2pkdGxwd2l4eWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE5NzQsImV4cCI6MjA5OTc5Nzk3NH0.UriL4MaxAR6xgqWhQGZOxTinXHfmM9yBZUcWRPHDfXs",
  workspace: "colegio",
  // Correo evaluador: SOLO esta cuenta puede saltar entre perfiles sin cerrar
  // sesión (para probar la app antes del piloto). Déjalo vacío para desactivarlo.
  evaluador: "fabian.perez@cmpe.cl"
};
// MODO PILOTO: true = app limpia (sin estudiantes ni datos de demostración),
// lista para mostrar/usar en el colegio. Pon false para volver a ver los datos de ejemplo.
window.PSICO_PILOTO = true;
