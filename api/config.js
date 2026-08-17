const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return res.status(500).json({ error: "Supabase não configurado na Vercel." });
  return res.status(200).json({ url, anonKey });
};
