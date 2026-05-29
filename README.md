# Truckly MVP

Plataforma mobile first para agendamento de fretes urbanos com visual de app nativo/PWA.

## Status do projeto

Este projeto ainda esta em fase de desenvolvimento e aperfeicoamento. As funcionalidades atuais servem para validar a experiencia de agendamento, estimativa de frete, escolha de veiculo e fluxo operacional antes da evolucao para uma versao final com backend, autenticacao, pagamentos e operacao em producao.

## Stack

- React + Vite
- Tailwind CSS
- Leaflet + React-Leaflet
- Context API + Hooks nativos
- Simulacao de dados via `src/data/constants.js`

## Arquitetura de Pastas

```txt
src/
  components/
    booking/
      BookingBottomSheet.jsx
      RoutePicker.jsx
      ScheduleGrid.jsx
      VehicleSelector.jsx
    map/
      RouteMap.jsx
  context/
    BookingContext.jsx
  data/
    constants.js
  hooks/
    useBooking.js
    usePageVisibilityAlert.js
  services/
    freightService.js
  utils/
    formatCurrency.js
  App.jsx
  index.css
  main.jsx
```

## Regras de Negocio

- Distancia calculada por Haversine entre origem e destino simulados.
- Preco dinamico: `valor = distanciaKm * fatorDoVeiculo`.
- Fatores definidos em `VEHICLE_OPTIONS` no arquivo de constantes.

## Diferenciais Implementados

- Mapa no topo (Mobile First) com rota simulada.
- BottomSheet persistente com cards horizontais de veiculo.
- Grid inteligente de horarios (desabilita horarios passados e destaca selecao).
- Acessibilidade com `aria-label`/`aria-live`.
- Page Visibility API: alerta quando o usuario sai da aba durante o agendamento.

## Rodando localmente

```bash
npm install
npm run dev
```

## Deploy Profissional

### Vercel

1. Importe o repositorio no painel da Vercel.
2. Framework detectado: Vite.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. O arquivo `vercel.json` ja inclui rewrite SPA para `index.html`.

### GitHub Pages

1. Faça push do projeto para o repositorio `Truckly`.
2. Em GitHub > Settings > Pages, selecione **GitHub Actions** como source.
3. O workflow `.github/workflows/deploy-gh-pages.yml` publica automaticamente a cada push na `master`.
4. URL final: `https://<seu-usuario>.github.io/Truckly/`.

## Sugestao de Conventional Commits

- `chore(scaffold): bootstrap truckly architecture and design system`
- `feat(map): add leaflet route map as mobile header`
- `feat(pricing): implement dynamic freight calculation by vehicle factor`
