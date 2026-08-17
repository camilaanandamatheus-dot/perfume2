const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { visitorId } = req.body || {};
    if (!visitorId) return res.status(400).json({ error: "visitorId obrigatório." });

    const { error } = await supabase.from("visits").insert({
      visitor_id: String(visitorId).slice(0, 120)
    });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erro ao registrar acesso." });
  }
};
