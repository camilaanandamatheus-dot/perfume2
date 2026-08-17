const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ error: "Não autenticado." });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return res.status(401).json({ error: "Sessão inválida." });

    const user = userData.user;
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || ""
      }
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erro ao carregar conta." });
  }
};
