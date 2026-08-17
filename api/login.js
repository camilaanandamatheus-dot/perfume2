const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Informe e-mail e senha." });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const normalized = String(email).trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password
    });

    if (error) {
      const message = /invalid login credentials/i.test(error.message)
        ? "E-mail ou senha incorretos. Se você ainda não tem conta, clique em “Criar conta”."
        : error.message;
      return res.status(401).json({ error: message });
    }

    return res.status(200).json({
      user: data.user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erro ao entrar." });
  }
};
