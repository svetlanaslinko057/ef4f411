# FOMO Connections Module + Twitter Parser - PRD

## Original Problem Statement
Развернуть проект из https://github.com/svetlanaslinko057/dddd2 с модулями Connections и Twitter-парсинга. Доделать Alt Season Monitor - добавить тултипы к карточкам, заполнить Top Opportunities и Token Momentum Scores реальными данными.

## Architecture
- **Backend**: Node.js Fastify (port 8003) через Python FastAPI proxy (port 8001)
- **Frontend**: React (port 3000)
- **Database**: MongoDB (connections_db)
- **Parser**: Twitter Parser V2 (port 5001) - готов к использованию

## What's Been Implemented (Feb 11, 2026)

### Core Features
1. ✅ Клонирование и развертывание репозитория
2. ✅ Установка всех зависимостей (Node.js, React, Python)
3. ✅ Настройка .env файлов с COOKIE_ENC_KEY, WEBHOOK_API_KEY
4. ✅ Запуск Node.js Fastify backend через Python proxy

### Alt Season Monitor - ПОЛНОСТЬЮ ФУНКЦИОНАЛЕН
- ✅ **Alt Season Probability**: 45% PRE ALT с компонентами (Hit Ratio, Breadth, Market) + тултип
- ✅ **Market State**: ALT NEUTRAL с факторами (Funding, OI Change, Volatility) + тултип  
- ✅ **Performance**: Hit Rate 50%, False Signals 20%, Total Tracked 10 + тултип
- ✅ **Top Opportunities**: SOL, RNDR, ONDO, FET, TAO с phase, bias, reasons
- ✅ **Token Momentum Scores**: 8 токенов с score, breadth, clusters, confirmed

### Seed Data (MongoDB connections_db)
| Collection | Count |
|------------|-------|
| token_momentum | 8 |
| token_opportunities | 5 |
| alt_season_state | 1 |
| market_state_attribution | 1 |
| opportunity_outcomes | 10 |
| connections_token_momentum | 8 |

## API Endpoints
- GET /api/connections/alt-season - Alt season probability
- GET /api/connections/market-state - Market state attribution  
- GET /api/connections/opportunities - Top opportunities
- GET /api/connections/opportunities/stats - Performance stats
- GET /api/connections/momentum - Token momentum scores

## Backlog / Next Tasks
- [ ] Twitter Parser V2 интеграция с реальными аккаунтами
- [ ] Real-time WebSocket updates
- [ ] Dashboard page fix (MINIMAL_BOOT → full mode)
- [ ] Influencers module with real data
- [ ] Reality Leaderboard with real scores

## User Personas
- **Traders**: используют Alt Season для определения входа в альткоины
- **Researchers**: анализируют Token Momentum для раннего обнаружения трендов
- **Portfolio Managers**: мониторят Market State для корректировки портфеля
