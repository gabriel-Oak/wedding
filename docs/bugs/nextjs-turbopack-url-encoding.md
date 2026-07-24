# Bug: Next.js Turbopack URL Parsing com + em Parâmetros de Telefone

**Criado em**: 24-07-2025  
**Status**: ✅ Corrigido  
**Severity**: High (quebra funcionalidade de convites)  
**Componentes Afetados**: `src/app/convite/page.tsx`, `src/modules/invite/hooks/useGuest.ts`

---

## 🐛 Problema

O Next.js com Turbopack falha ao parsear URLs contendo `+` (sinal de mais) em parâmetros de query string, mesmo quando corretamente codificados como `%2B`.

### Sintomas

```
TypeError: Failed to parse URL from /api/guests?phone=%2B553891364011
    at resolveErrorDev (react-server-dom-turbopack-client.browser.development.js:3260:51)
    at processFullStringRow (react-server-dom-turbopack-client.browser.development.js:4427:23)
```

### Reprodução

1. Navegar para `/convite?guestPhone=%2B553891364011`
2. Server component tenta fazer fetch de `/api/guests?phone=%2B553891364011`
3. Next.js Turbopack lança `TypeError: Failed to parse URL`
4. Cliente não carrega dados do convidado

---

## 🔍 Causa Raiz

O **Next.js Turbopack** tem um bug ao processar URLs com `%2B` no server component. O problema ocorre especificamente quando:

1. URL contém `%2B` (codificação de `+`)
2. Fetch é feito dentro de um server component (async function)
3. Turbopack está ativo (dev mode)

### Por que `encodeURIComponent` não funciona?

`encodeURIComponent('+')` retorna `%2B`, mas o Next.js Turbopack falha ao parsear URLs com `%2B` no server side. O problema **não existe** no client side — fetches feitos diretamente no browser funcionam corretamente.

### Diferença Server vs Client

| Contexto             | `+` sem encode              | `%2B` (encode)     |
| -------------------- | --------------------------- | ------------------ |
| **Server Component** | ❌ Erro 500                 | ❌ TypeError (BUG) |
| **Client Component** | ⚠️ Interpretado como espaço | ✅ Funciona        |

---

## ✅ Solução

**Remover fetches de dados de convidados do server component e mover para client component.**

### Antes (❌ BROKEN)

```tsx
// src/app/convite/page.tsx (SERVER COMPONENT)
export default async function ConvitePage({ searchParams }) {
  const params = await searchParams;
  const guestPhone = params.guestPhone || '';

  // ❌ BROKEN: Next.js Turbopack falha ao parsear URL com %2B
  const res = await fetch(`/api/guests?phone=${guestPhone}`);
  const json = await res.json();
  const initialGuest = json.data?.[0] || null;

  return <ConvitePageClient initialGuest={initialGuest} ... />;
}
```

### Depois (✅ CORRECTO)

```tsx
// src/app/convite/page.tsx (SERVER COMPONENT)
export default async function ConvitePage({ searchParams }) {
  const params = await searchParams;
  const guestPhone = params.guestPhone || "";

  // ✅ CORRECTO: Não faz fetch no server. Client faz via useGuest hook.
  // O server apenas passa o phone para o client component.

  return <ConvitePageClient guestPhone={guestPhone} />;
}
```

```tsx
// src/modules/invite/hooks/useGuest.ts (CLIENT COMPONENT)
"use client";

async function fetchGuestByPhone(phone: string) {
  // ✅ URLSearchParams funciona corretamente no client side
  const params = new URLSearchParams({ phone });
  const res = await fetch(`/api/guests?${params.toString()}`);
  // ...
}
```

---

## 📋 Regras para Evitar Regressões

### ✅ FAZER

1. **Sempre usar client components para fetches de dados de convidados**
   - Usar `useGuest` hook em components marcados com `'use client'`
   - Server components apenas recebem dados via props

2. **Usar `URLSearchParams` para construir URLs**

   ```tsx
   const params = new URLSearchParams({ phone: guestPhone });
   const url = `/api/guests?${params.toString()}`;
   ```

3. **Testar com números de telefone reais**
   - Sempre testar com `+55` ou `+` no início
   - URL: `?guestPhone=%2B553891364011`

### ❌ NÃO FAZER

1. **NUNCA fazer fetch de `/api/guests` em server components**
   - Mesmo com encoding correto, o Turbopack falha

2. **NUNCA usar template literals com `+` direto**

   ```tsx
   // ❌ BROKEN
   fetch(`/api/guests?phone=${guestPhone}`);
   ```

3. **NUNCA confiar em `encodeURIComponent` para URLs com `+`**
   - `encodeURIComponent('+')` → `%2B` (funciona no client, não no server)

---

## 🧪 Testes

### Teste Manual

```bash
# 1. Iniciar dev server
npm run dev

# 2. Navegar com número de telefone codificado
open "http://localhost:3000/convite?guestPhone=%2B553891364011"

# 3. Verificar console (deve estar limpo)
# Press Cmd+Option+J (Mac) ou Ctrl+Shift+J (Windows/Linux)

# 4. Validar que o nome do convidado aparece
# Deve mostrar: "Olá, Rayane!"
```

### Teste Automatizado

```bash
# Rodar testes
npm test

# Rodar e2e tests
npm run test:e2e
```

**Testes devem passar:**

- ✅ 78/78 unit tests
- ✅ 8/8 e2e tests (2 skipped - RSVP disabled, pré-existente)

---

## 📚 Referências

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [React 'use client' Directive](https://react.dev/reference/rsc/use-client)
- [URLSearchParams MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

---

## 🔄 Histórico

| Data       | Ação                      | Autor    |
| ---------- | ------------------------- | -------- |
| 24-07-2025 | Bug detectado e corrigido | AI Agent |
| 24-07-2025 | Documentação criada       | AI Agent |

---

**⚠️ IMPORTANTE**: Se alguém tentar adicionar fetches de `/api/guests` em server components novamente, o bug voltará. Seguir estritamente as regras acima.
