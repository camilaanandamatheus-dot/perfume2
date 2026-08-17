# Perfumaria Sutan — Banco e Login

## 1. Supabase
No Supabase, execute o arquivo `supabase-schema.sql` que você já possui.

Depois confirme que as tabelas `profiles`, `orders` e `visits` foram criadas.

## 2. Vercel
Importe esta pasta/repositório na Vercel.

Em **Settings > Environment Variables**, crie:

- `SUPABASE_URL` = URL do seu projeto Supabase
- `SUPABASE_ANON_KEY` = chave pública anon
- `SUPABASE_SERVICE_ROLE_KEY` = chave service_role (NUNCA coloque essa chave no HTML)

Depois faça Redeploy.

## 3. Login/cadastro
O site usa:
- `/api/signup`
- `/api/login`
- `/api/me`
- `/api/my-orders`
- `/api/create-order`

Se o e-mail não existir, o login informa que a pessoa deve criar uma conta.
Se já existir, o Supabase valida a senha e cria a sessão.

## 4. Importante
As variáveis ficam somente na Vercel. Não cole a `service_role` no `index.html` e não publique essa chave no GitHub.
