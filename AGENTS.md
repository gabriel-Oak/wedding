# Wedding App - Project Context

## 🎨 Wedding Color Palette

Inspired by the venue photo (`image_f83ac3.jpg`). Use these tokens throughout the project.

| Token          | Hex       | Tailwind        | Usage                          |
| -------------- | --------- | --------------- | ------------------------------ |
| Azul Principal | `#1E5FA7` | `wedding-blue`  | Backgrounds, accents           |
| Branco Base    | `#FAFAFA` | `wedding-cream` | Page background                |
| Dourado        | `#D4AF37` | `wedding-gold`  | Decorative details, highlights |
| Madeira        | `#5C4033` | `wedding-wood`  | Dark text, fine lines          |

### Typography

- **Headings**: _Playfair Display_ (`font-heading`)
- **Body**: _Montserrat_ (`font-body`)

## 🔒 Restrições de Segurança

### Confirmação de Presença (RSVP)

- **Usuários não podem alterar confirmações** após envio
- **RSL configurado**: apenas o criador do registro pode ler/atualizar
- **Alterações manuais**: devem ser feitas manualmente pelo admin com a chave de admin (`SUPABASE_KEY`)
- **Nunca usar** `SUPABASE_KEY` nas rotas de API — apenas `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🌐 Deploy & Variáveis de Ambiente

### Vercel

- **Projeto**: `gabriel_e_mariana`
- **URL de produção**: `https://gabrielandmariana.vercel.app`
- **Variáveis de ambiente**: configurar no Vercel dashboard (não usar hardcoded no `.env`)

### Supabase Auth - Magic Link Redirect

**CRÍTICO**: O Supabase Auth usa URLs de redirect whitelistadas no painel.

**Painel do Supabase** → Authentication → URL Configuration:

- Adicionar `http://localhost:3000` (dev)
- Adicionar `https://gabrielandmariana.vercel.app` (prod)

Sem isso, o `emailRedirectTo` é ignorado e o magic link sempre redireciona para localhost.

### Variáveis de Ambiente

- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima pública
- `SUPABASE_URL` - URL do projeto Supabase (server-side)
- `SUPABASE_KEY` - Chave secreta (APENAS server-side, nunca expor)

**NUNCA hardcoded** `NEXT_PUBLIC_URL=http://localhost:3000` no `.env` — use caminhos relativos em fetches server-side.
