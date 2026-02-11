# FOMO Connections Module - PRD

## Original Problem Statement
Развернуть модули Connections и Twitter Parser. Восстановить seed данные, сделать функциональными: Influencers, Reality Leaderboard, Backers, Radar, Alt Season, Narrative Intelligence, **Influence Network (Graph)**.

## Architecture
- **Backend**: Node.js Fastify (port 8003) через Python FastAPI proxy (port 8001)
- **Frontend**: React (port 3000)
- **Database**: MongoDB (connections_db)
- **Parser**: Twitter Parser V2 (port 5001)

## Core Features Implemented

### 1. Influencers Module (/connections/influencers)
- 8 unified accounts с реальными данными
- Twitter Score, Authority Score, Followers
- Group filtering (Smart Money, Influence, etc.)
- Real Data facet (PLAYWRIGHT_PARSER source)

### 2. Reality Leaderboard (/connections/reality)
- 8 actors с reality scores
- Formula: truth_raw, coverage, sample_conf, authority_w
- Verdict tracking: Confirms, Contradicts, No Data
- Level classification: ELITE, STRONG, MIXED, RISKY

### 3. Backers Module (/connections/backers)
- 8 backers: a16z, Paradigm, Polychain, Multicoin, Binance Labs, Coinbase Ventures, Vitalik, Balaji
- Type filtering: VC Funds, Influencers, NFT Projects
- Backer bindings to projects

### 4. Radar (Early Signal) (/connections/radar)
- Early signal detection algorithm
- Profile types: Retail, Influencer, Whale
- Signal badges: Rising, Breakout, None
- Radar view + Table view

### 5. Alt Season Monitor (/connections/alt-season)
- Alt Season Probability calculation
- Market State: ALT_BULLISH, ALT_NEUTRAL, BTC_ONLY
- Components: Hit Ratio, Breadth, Market Friendliness
- Token Momentum Scores

### 6. Narrative Intelligence (/connections/narratives)
- 5 Active Narratives: RESTAKING, AI_AGENTS, DEPIN, RWA_TOKENIZATION, BTC_L2
- Narrative Momentum Score (NMS)
- Token Candidates with scoring
- Alpha Signals with explanations

### 7. Influence Network (Graph) (/connections/graph) - NEW
- **Search-based UX**: Empty by default, shows graph when user searches
- **Layer filters**: Co-Invested, Follow, Onchain, Media - toggle on/off
- **Sliders**: Min Confidence, Min Weight
- **Anchors toggle**: Include/exclude backers as anchors
- **Handshake**: Click Node A + Node B to find path
- **Legend**: Complete with all edge types
- **Renamed**: "Influence Network" (removed V2)

## What's Been Implemented (Feb 11, 2026)
- [x] Repository cloned (svetlanaslinko057/ffff)
- [x] Backend configured with Node.js Fastify
- [x] Frontend dependencies installed
- [x] MongoDB seed data restored:
  - 8 unified_accounts (PLAYWRIGHT_PARSER)
  - 160 reality_ledger entries
  - 8 backers with ACTIVE status
  - 24 follow edges between influencers
  - 5 narratives + bindings
  - Alpha candidates
- [x] Search icons (magnifying glass) removed from all inputs
- [x] All 7 connection pages functional
- [x] Graph page fully redesigned with search-first UX
- [x] All APIs tested and working

## Seed Data Summary
| Collection | Count |
|------------|-------|
| connections_unified_accounts | 8 |
| connections_reality_ledger | 160 |
| connections_backers | 8 |
| parser_follow_edges | 24 |
| narratives | 5 |
| alpha_candidates | 3 |

## Backlog / Next Tasks
- [ ] Twitter Parser V2 integration with real accounts
- [ ] Real-time WebSocket updates
- [ ] Dashboard page fix (MINIMAL_BOOT → full mode)
- [ ] Token Momentum calculation from parser data
- [ ] Opportunity detection for Alt Season

## API Endpoints
- GET /api/connections/unified - Unified accounts
- GET /api/connections/reality/leaderboard - Reality scores
- GET /api/connections/backers - Backers list
- GET /api/connections/radar/accounts - Early signals
- GET /api/connections/alt-season - Alt season state
- GET /api/connections/graph/v2?handle=X - Graph for account
- POST /api/connections/handshake/v2 - Find path between nodes
- GET /api/market/narratives - Narratives list
- GET /api/alpha/top - Alpha signals
