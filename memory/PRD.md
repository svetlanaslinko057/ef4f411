# FOMO Connections Module - PRD

## Original Problem Statement
Развернуть проект с модулями Connections и Twitter-парсинга. Запустить Strategy Simulation, Farm Network Graph и Alt Season Monitor с понятными объяснениями для пользователей.

## Architecture
- **Backend**: Node.js Fastify (port 8003) через Python FastAPI proxy (port 8001)
- **Frontend**: React (port 3000)  
- **Database**: MongoDB (connections_db)
- **Parser**: Twitter Parser V2 (port 5001)

## Implemented Features (Feb 11, 2026)

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

### 2. Farm Network Graph ✅ (Для АДМИНА)
**Назначение:** Визуализация бот-ферм и их связей

**Добавлены объяснения:**
- Блок "What is Farm Network?" с 3 карточками:
  - Bot Farms - что это
  - How We Detect - как обнаруживаем
  - Why It Matters - почему важно
- Легенда "How to read the graph":
  - Nodes = подозрительные аккаунты
  - Lines = общие боты
  - Thicker = больше общих ботов
  - Red = 70%+ overlap (одна бот-ферма)

**Данные:** 10 узлов, 13 рёбер (crypto_whale_alerts, moon_signals, gem_hunter_pro...)

### 3. Alt Season Monitor ✅ (Для ПОЛЬЗОВАТЕЛЕЙ)
**Назначение:** Монитор вероятности альтсезона

**Метрики:**
- ASP: 45% (PRE_ALT)
- Market State: ALT_NEUTRAL
- Performance: 50% Hit Rate, 20% False Signals, 10 Tracked
- Top Opportunities: SOL (82), RNDR (78), ONDO (72), FET (68), TAO (65)
- Token Momentum: 8 токенов

## Test Results
- Backend: 100% ✅
- Frontend: 100% ✅

## Backlog / Next Tasks
- [ ] Подключить реальные Twitter данные через парсер (куки включены)
- [ ] Backers module activation
- [ ] WebSocket real-time updates
- [ ] Reality Leaderboard integration

## User Personas
- **Traders:** Strategy Simulation + Alt Season для выбора entry points
- **Researchers:** Farm Network для анализа манипуляций
- **Admins:** Farm Network для выявления координированных атак
