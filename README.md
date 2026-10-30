# MilkTrace

Sistema de triagem de doadoras do Banco de Leite Humano.

- `backend/`: API em Fastify + Supabase
- `frontend/miltrace/`: Next.js (telas)

## Como rodar

### 1. Banco (Supabase)

Rode no SQL Editor do Supabase o arquivo
`backend/database/migrations/001_triagem_campos_extras.sql`. Ele cria as colunas
das etapas Gestação, Coleta e Sorologia na tabela `trials`. Sem ele, a triagem
é salva normalmente, mas sem essas etapas.

### 2. Backend

```bash
cd backend
cp .env.example .env   # preencha SUPABASE_URL e SUPABASE_KEY
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend/miltrace
cp .env.example .env.local
npm install
npm run dev
```

Acesse http://localhost:3000 e entre com um usuário cadastrado no Supabase Auth.
O frontend chama o backend por `/api/*` (ver `next.config.mjs`).

## Telas

| Rota | Tela |
| --- | --- |
| `/Login` | Login |
| `/` | Início (indicadores e triagens recentes) |
| `/Triagem` | Nova triagem em 6 etapas (`?editar=ID` edita, `?doadora=ID` reaproveita os dados da doadora) |
| `/Doadoras` | Lista de doadoras com busca |
| `/Doadoras/[id]` | Detalhe da triagem, pontos de atenção e histórico da doadora |
| `/Historico` | Todas as triagens, filtro por período e exportação CSV |
| `/Usuarios` | Equipe com acesso ao sistema (`/Usuarios/novo`, `/Usuarios/[id]`) |
| `/Perfil` | Dados do usuário logado |
