const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Faça login antes de finalizar o pedido." });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData.user) return res.status(401).json({ error: "Sessão inválida." });

    const { items, total } = req.body || {};
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: "Carrinho vazio." });

    const safeTotal = Number(total);
    if (!Number.isFinite(safeTotal) || safeTotal < 0) return res.status(400).json({ error: "Total inválido." });

    const code = "SUT-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" +
      Math.random().toString(36).slice(2,8).toUpperCase();

    const { data, error } = await supabase.from("orders").insert({
      user_id: userData.user.id,
      order_code: code,
      total: safeTotal,
      items,
      status: "novo"
    }).select("id,order_code,total,status,created_at").single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ order: data });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erro ao criar pedido." });
  }
};
