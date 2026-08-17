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

    const [{ data: profiles }, { data: orders }] = await Promise.all([
      supabase.from("profiles").select("id,name,email,role,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("orders").select("id,order_code,total,status,created_at,user_id,items").order("created_at", { ascending: false }).limit(100)
    ]);

    return res.status(200).json({ profiles: profiles || [], orders: orders || [] });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erro no painel." });
  }
};
