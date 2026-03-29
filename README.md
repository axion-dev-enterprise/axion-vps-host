# Pontotecc Web (Preview 0.1.0)

Aplicação web do MVP: catálogo, páginas de produto e CTAs para orçamento/financiamento.

## Objetivo

Entregar um MVP funcional em até 10 dias corridos, com staging temporário em subdomínio `*.axionenterprise.cloud`, documentação adequada e trilha de QA/artefatos.

## Desenvolvimento local

```bash
npm install
npm run dev
```

- Web: http://localhost:3000

## Backend/API

O backend fica em [backend](backend) e segue padrão REST em camadas (controller/service/repository).

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

- API: http://localhost:3001 (ou `PORT` no `.env`)
- Configure `CORS_ORIGIN` no backend com `http://localhost:3000` em dev.
- Docs do backend: [backend/README.md](backend/README.md)

## Scripts

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

- `start` usa `server.js` (compatível com Passenger/cPanel).
- Health check: `/health`

## Docs operacionais

- Instruções e regras: [AGENTS.md](AGENTS.md)
- Entrypoints por área: [agents/entrypoints](agents/entrypoints)
- Arquitetura e stack: [architecture](architecture)
- Deploy/ambientes: [deploy](deploy)
- Planejamento e backlog: [planning](planning)
- QA e aceite: [qa](qa)
- Templates (PR/Issue/Release): [templates](templates)
- Artefatos e entregáveis: [artifacts](artifacts)
