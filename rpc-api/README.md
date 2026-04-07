# RPC API

A lightweight, production-ready Node.js/TypeScript API server for proxying and managing blockchain RPC endpoints (BSC, Polygon, etc). Designed for reliability, security, and easy deployment.

## Features
- **Express-based REST API** for blockchain RPC requests
- **CORS, Helmet, and rate limiting** for security
- **Configurable allowed domains** via environment variables
- **Health check endpoints** for monitoring
- **Modular service structure** for easy extension

## Endpoints
- `/rpc/bsc` — Proxy for BSC RPC requests
- `/rpc/polygon` — Proxy for Polygon RPC requests
- `/` and `/health` — Health check endpoints

## Getting Started
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set required variables (see `src/services-impl/EnvConfig.ts`)
3. **Run the server:**
   ```sh
   npm start
   ```

## Project Structure
- `src/` — Main source code
- `data/` — RPC endpoint lists
- `test_rpc_cors.html` — CORS testing utility

## License
This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
