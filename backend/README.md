# Pontotecc Backend (Preview 0.2.0)

API do MVP para catalogo, leads e integracoes futuras.

## Desenvolvimento local

```bash
cd backend
npm install
npm run dev
```

- API: http://localhost:3001
- Health: `/health`
- Configure `CORS_ORIGIN=http://localhost:3000` em desenvolvimento.

## Contrato compartilhado

- Pacote: [../shared/pontotecc-contract](../shared/pontotecc-contract)
- `GET /api/v1/phones` retorna `data` + `meta`.
- `GET /api/v1/phones/:id` retorna `data`.
- O controller valida query params com o mesmo schema usado pelo frontend.

## Scripts

```bash
npm run typecheck
npm run test
npm run build
npm run start
```

## Docs

- Contrato frontend/backend: [../docs/internal/frontend-backend-contract.md](../docs/internal/frontend-backend-contract.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)
