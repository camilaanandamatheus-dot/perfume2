const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Não autenticado." });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData.user) return res.status(401).json({ error: "Sessão inválida." });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).single();
    if (profile?.role !== "admin") return res.status(403).json({ error: "Acesso negado." });

    const code = String(req.query?.code || "").trim().toUpperCase();
    if (!code) return res.status(400).json({ error: "Informe o ID do pedido." });

    const { data: order, error } = await supabase.from("orders").select("*").eq("order_code", code).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!order) return res.status(404).json({ error: "Pedido não encontrado." });

    return res.status(200).json({ order });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erro ao consultar pedido." });
  }
};
