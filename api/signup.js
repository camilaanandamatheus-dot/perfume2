const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "Preencha nome, e-mail e senha." });
    if (password.length < 8) return res.status(400).json({ error: "A senha deve ter pelo menos 8 caracteres." });

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.auth.signUp({
      email: String(email).trim().toLowerCase(),
      password,
      options: { data: { name: String(name).trim() } }
    });

    if (error) {
      const msg = /already registered|already exists|User already registered/i.test(error.message)
        ? "Este e-mail já está cadastrado. Faça login."
        : error.message;
      return res.status(400).json({ error: msg });
    }

    if (!data.session) {
      return res.status(200).json({
        user: data.user,
        accessToken: null,
        refreshToken: null,
        requiresEmailConfirmation: true,
        message: "Conta criada. Confirme seu e-mail para entrar."
      });
    }

    return res.status(200).json({
      user: data.user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erro ao criar conta." });
  }
};
