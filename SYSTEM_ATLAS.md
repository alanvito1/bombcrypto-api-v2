# 🪐 SYSTEM ATLAS - BombCrypto API v2

Este documento serve como a fonte única de verdade (SSOT) para a infraestrutura, serviços e fluxos de dados do ecossistema BombCrypto API v2.

## 🛠️ Serviços Orquestrados

| Serviço | Container Name | Porta (Host) | Descrição |
| :--- | :--- | :--- | :--- |
| **TH Mode Server** | `ap-th-server` | `8106` | Backend principal para o modo Treasure Hunt. Processa dados do Redis/Mock. |
| **RPC API** | `ap-rpc-api` | `8105` | Interface de comunicação RPC para interações com o jogo. |
| **Blockchain Center** | `ap-blockchain-center` | `8107` | Centralizador de monitoramento e integração com a blockchain. |
| **TH Mode Client** | `th-mode-client` | `5173`* | Dashboard React/Vite para visualização de dados em tempo real. |

*\* Porta padrão do Vite, acessível localmente via browser.*

---

## 🛣️ API Endpoints (TH Mode Server)

Base URL: `http://localhost:8106`

| Método | Rota | Descrição | Segurança / Notas |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health Check básico do servidor. | Aberto |
| `GET` | `/health` | Health Check detalhado. | Aberto |
| `GET` | `/th/` | Health Check do módulo TH. | Aberto |
| `GET` | `/th/leaderboard` | Exportação de dados do Leaderboard (Treasure Hunt). | Requer Referer válido & Rate Limit (5 req/5s) |

---

## ⚙️ Variáveis de Ambiente Críticas

### `th-mode-server` (`.env`)

| Variável | Importância | Impacto no Ambiente Local |
| :--- | :--- | :--- |
| `USE_MOCK_DATA` | **CRÍTICA** | Se `true`, o sistema ignora o Redis e usa o `FakeMessengerService` para gerar dados aleatórios. Essencial para dev sem infra completa. |
| `REDIS_CONNECTION_STRING` | Alta | Define onde o servidor buscará os eventos reais do jogo quando o Mock está desligado. |
| `PORT` | Média | Porta interna do container (mapeada para `8106` no host). |
| `TZ` | Baixa | Define o fuso horário (`Asia/Bangkok` por padrão). |

---

## 🔄 Fluxo de Dados (Deep Scan)

### Modo Simulação (Mock)
1. `FakeMessengerService` gera payloads randômicos de eventos TH.
2. `LeaderBoardHandler` processa e armazena o estado atual em memória.
3. `th-mode-client` solicita dados via `/th/leaderboard`.
4. O servidor valida o CORS (aberto para dev) e entrega o JSON.

### Modo Produção (Real)
1. Redis Stream recebe eventos brutos do jogo.
2. `MessengerService` consome o stream e decodifica as mensagens.
3. `LeaderBoardHandler` atualiza o ranking dinâmico.
4. `th-mode-client` exibe os dados reais processados.

---

> [!TIP]
> **Manutenção:** Para adicionar novos serviços, atualize o `compose.yaml` e reflita as mudanças neste atlas.
