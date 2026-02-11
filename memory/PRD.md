# FOMO Connections Module - PRD

## Original Problem Statement
Развернуть проект с модулями Connections и Twitter-парсинга. Запустить Strategy Simulation, Farm Network Graph и Alt Season Monitor с понятными объяснениями для пользователей.

## Architecture
- **Backend**: Node.js Fastify (port 8003) через Python FastAPI proxy (port 8001)
- **Frontend**: React (port 3000)  
- **Database**: MongoDB (connections_db)
- **Parser**: Twitter Parser V2 (port 5001)

## Implemented Features

### 1. Strategy Simulation ✅ (Для ПОЛЬЗОВАТЕЛЕЙ)
**Назначение:** "Что если следовать за определённым типом Twitter-инфлюенсеров?"

**Добавлены объяснения:**
- Блок "How Strategy Simulation Works" с вопросом-ответом
- Кто такие **Actors** (инфлюенсеры с поведенческими профилями)
- Что означают **метрики** (Hit Rate, Follow Through, Noise Ratio, Sample Size)
- **4 стратегии** с раскрывающимися описаниями:
  - EARLY_CONVICTION_ONLY (68% hit rate, High risk) - охотники за альфой
  - LONG_TERM_ACCUMULATORS (58% hit rate, Low risk) - терпеливые строители
  - HIGH_AUTHENTICITY (72% hit rate, Medium risk) - проверенные инфлюенсеры
  - AVOID_PUMP_EXIT (62% hit rate, Low-Medium risk) - исключает манипуляторов
- **Historical Events** с кликабельными @username ссылками

### 2. Farm Network Graph ✅ + Interactive Modal (Feb 11, 2026)
**Назначение:** Визуализация бот-ферм и их связей с детальной информацией по акторам

**Добавлены объяснения:**
- Блок "What is Farm Network?" с 3 карточками:
  - Bot Farms - что это
  - How We Detect - как обнаруживаем
  - Why It Matters - почему важно
- Легенда "How to read the graph"

**NEW - Интерактивная модалка ActorDetailsModal:**
- Клик на узел графа или имя в таблице открывает модальное окно с детальной информацией
- **Показывает:**
  - Risk Level (LOW/MEDIUM/HIGH/CRITICAL) с цветовой индикацией
  - Summary (краткое описание актора)
  - **Audience Quality**: AQI score, % human, % bots, % suspicious, % dormant, total followers
  - **Authenticity Score**: общий скор + breakdown (realFollowerRatio, audienceQuality, networkIntegrity)
  - **Shared Farm Connections**: список связанных акторов (кликабельные)
  - **Detected Bot Farms**: farmId, botRatio, confidence, участники
- Кликабельные имена для навигации между акторами
- Link на Twitter профиль

**Данные:** 10 узлов, 12+ рёбер (crypto_whale_alerts, moon_signals, gem_hunter_pro, 100x_calls, pump_detective, etc.)

### 3. Alt Season Monitor ✅ (Для ПОЛЬЗОВАТЕЛЕЙ)
**Назначение:** Монитор вероятности альтсезона

**Метрики:**
- ASP: 45% (PRE_ALT)
- Market State: ALT_NEUTRAL
- Performance: 50% Hit Rate, 20% False Signals, 10 Tracked
- Top Opportunities: SOL (82), RNDR (78), ONDO (72), FET (68), TAO (65)
- Token Momentum: 8 токенов

## Key API Endpoints
- `GET /api/connections/network/farm-graph` - граф с узлами и рёбрами
- `GET /api/connections/network/actor/:actorId` - детальная информация об акторе для модала
- `GET /api/connections/simulation/strategies` - стратегии симуляции
- `GET /api/alt-season` - данные альтсезона

## Test Results (Feb 11, 2026)
- Backend: 100% ✅
- Frontend: 95% ✅ (minor backdrop click fix applied)
- Actor Details Modal: 100% ✅

## Backlog / Next Tasks
- [ ] Подключить реальные Twitter данные через парсер
- [ ] Backers module activation
- [ ] WebSocket real-time updates
- [ ] Reality Leaderboard integration
- [ ] Fix duplicate route warnings in backend

## User Personas
- **Traders:** Strategy Simulation + Alt Season для выбора entry points
- **Researchers:** Farm Network для анализа манипуляций и детального исследования акторов
- **Admins:** Farm Network для выявления координированных атак
