const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Não autenticado." });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData.user) return res.status(401).json({ error: "Sessão inválida." });

    const { data, error } = await supabase
      .from("orders")
      .select("id,order_code,total,status,created_at,items")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ orders: data || [] });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erro ao carregar pedidos." });
  }
};
