# bombcrypto-api-v2

Open-source monorepo for **BombCrypto** backend services and client applications.

---

## Packages

### TH Mode — [treasure-mode.bombcrypto.io](https://treasure-mode.bombcrypto.io/)

| Package | Description |
|---|---|
| [`th-mode-server`](th-mode-server/) | Leaderboard backend — consumes Redis Stream race events and exposes a REST API for the moderator client |
| [`th-mode-client`](th-mode-client/) | Moderator client UI — React app that polls the server and renders live leaderboard rankings |

### Shared Services

| Package | Description |
|---|---|
| [`rpc-api`](rpc-api/) | Blockchain RPC proxy — routes BSC and Polygon RPC requests with CORS, rate limiting, and health checks. Used across multiple BombCrypto pages |
| [`blockchain-center-api`](blockchain-center-api/) | EVM blockchain interaction hub — block numbers, contract calls, log fetching, transactions, and an RPC monitoring dashboard. Used across multiple BombCrypto pages |

---

## TH Mode Architecture

```
Redis Stream (SV_TH_MODE_RACE)
        │
        ▼
 th-mode-server          ←── REST API ──→  th-mode-client
 (leaderboard engine)                      (moderator UI)
```

- The game backend publishes hero race events to a Redis Stream.
- **th-mode-server** consumes those events, scores heroes per rarity pool, and caches the sorted leaderboard in memory.
- **th-mode-client** periodically calls the server's `/th/leaderboard` endpoint to display live standings.

---

## Quick Start

Each package is self-contained. See the individual READMEs for full setup:

- [th-mode-server/README.md](th-mode-server/README.md)
- [rpc-api/README.md](rpc-api/README.md)

### th-mode-server

```bash
cd th-mode-server
npm install
cp .env.example .env   # fill in REDIS_CONNECTION_STRING (or set USE_MOCK_DATA=true)
npm start
```

### th-mode-client

```bash
cd th-mode-client
npm install
npm start
```

### rpc-api

```bash
cd rpc-api
npm install
cp .env.example .env
npm start
```

### blockchain-center-api

```bash
cd blockchain-center-api
cp rpc.config.example.json rpc.config.json   # fill in your RPC endpoints
npm install
node server.js
```

---

## Development — Mock Data Mode

To run the TH Mode UI locally **without a Redis instance**, start `th-mode-server` with mock data enabled:

```env
# th-mode-server/.env
USE_MOCK_DATA=true
```

The server will generate synthetic hero race events across all six rarity pools (`Common` → `SuperLegend`) on every refresh interval, so `th-mode-client` can be developed and tested against a live leaderboard with no external dependencies.

---

## License

Licensed under the [GNU Affero General Public License v3.0](LICENSE).
