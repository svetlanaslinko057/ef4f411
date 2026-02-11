# FOMO Connections Module - PRD

## Original Problem Statement
Развернуть проект с модулями Connections и Twitter-парсинга. Запустить и активировать Strategy Simulation, Farm Network Graph, Alt Season Monitor.

## Architecture
- **Backend**: Node.js Fastify (port 8003) через Python FastAPI proxy (port 8001)
- **Frontend**: React (port 3000)  
- **Database**: MongoDB (connections_db)
- **Parser**: Twitter Parser V2 (port 5001)

## Implemented Features (Feb 11, 2026)

### 1. Strategy Simulation (Block 28) ✅
**Назначение:** Исследовательский инструмент - "Что если следовать за определённым типом акторов?"

**Стратегии:**
| Strategy | Hit Rate | Follow Through | Target |
|----------|----------|----------------|--------|
| EARLY_CONVICTION_ONLY | 68% | +12.4% | Для пользователей |
| LONG_TERM_ACCUMULATORS | 58% | +8.2% | Для пользователей |
| HIGH_AUTHENTICITY | 72% | +10.8% | Для пользователей |
| AVOID_PUMP_EXIT | 62% | +9.5% | Для пользователей |

**Вердикт:** ✅ Инструмент для ПОЛЬЗОВАТЕЛЕЙ. Помогает выбрать тип акторов для follow.

### 2. Farm Network Graph (Block 19) ✅
**Назначение:** Визуализация бот-ферм и их связей

**Данные:**
- 8 nodes (подозрительные аккаунты)
- 10 edges (общие бот-фолловеры)
- Overlap scores: 35%-72%

**Вердикт:** 🔒 Инструмент для АДМИНА. Выявление координированных атак.

### 3. Alt Season Monitor (Blocks 9-10) ✅
**Назначение:** Монитор вероятности альтсезона

**Метрики:**
- ASP: 45% (PRE_ALT)
- Market State: ALT_NEUTRAL
- Performance: 50% Hit Rate
- Top Opportunities: SOL, RNDR, ONDO, FET, TAO
- Token Momentum: 8 токенов

**Вердикт:** ✅ Инструмент для ПОЛЬЗОВАТЕЛЕЙ. Помогает с входом в альткоины.

## API Endpoints Summary
| Module | Endpoint | Status |
|--------|----------|--------|
| Strategy Sim | /api/connections/simulation/strategies | ✅ |
| Strategy Sim | /api/connections/simulation/{name} | ✅ |
| Strategy Sim | POST /api/connections/simulation/run | ✅ |
| Farm Network | /api/connections/network/farm-graph | ✅ |
| Alt Season | /api/connections/alt-season | ✅ |
| Alt Season | /api/connections/market-state | ✅ |
| Alt Season | /api/connections/opportunities | ✅ |
| Alt Season | /api/connections/momentum | ✅ |

## MongoDB Collections
| Collection | Records |
|------------|---------|
| strategy_simulations | 4 |
| actor_behavior_profiles | 8 |
| actor_events | 8 |
| price_history | 210 |
| farm_overlap_edges | 10 |
| farm_graph_nodes | 8 |
| alt_season_state | 1 |
| token_opportunities | 5 |
| connections_token_momentum | 8 |

## Next Tasks / Backlog
- [ ] Подключить реальные Twitter данные через парсер
- [ ] Admin Simulation Engine (Phase 4.7) - FREEZE validation
- [ ] Reality Leaderboard integration
- [ ] WebSocket real-time updates
- [ ] Backers module activation

## User Personas
- **Traders:** Strategy Simulation + Alt Season для выбора entry points
- **Researchers:** Farm Network для анализа манипуляций
- **Admins:** FREEZE simulation scenarios для валидации системы
