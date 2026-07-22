<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

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
- **RLS configurado**: apenas o criador do registro pode ler/atualizar
- **Alterações manuais**: devem ser feitas manualmente pelo admin com a chave de admin (`SUPABASE_KEY`)
- **Nunca usar** `SUPABASE_KEY` nas rotas de API — apenas `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Chaves Supabase

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → usada nas rotas de API (permissões limitadas)
- `SUPABASE_KEY` → **apenas** para operações manuais/admin (nunca expor no código)
