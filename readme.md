# Aze

A modular WhatsApp bot built on [Baileys 7](https://www.npmjs.com/package/baileys).

## Layout

```
src/
├── index.ts                   entry — boots the bot
├── config/env.ts              env loading and validation
├── core/
│   ├── client.ts              Baileys socket lifecycle + reconnect
│   ├── auth.ts                multi-file auth state
│   └── logger.ts              pino logger
├── messaging/
│   ├── types.ts               ParsedMessage / Media types
│   ├── parser.ts              normalizes a WAMessage
│   └── sender.ts              ergonomic send/reply/react helpers
├── commands/
│   ├── types.ts               Command interface + defineCommand()
│   ├── registry.ts            name + alias resolution
│   ├── loader.ts              filesystem auto-discovery
│   └── modules/
│       ├── general/           ping, help, echo, uptime
│       ├── group/             tagall, groupinfo
│       ├── media/             sticker
│       └── owner/             shutdown
├── middleware/
│   ├── pipeline.ts            koa-style composition
│   ├── logger.ts              command timing + error capture
│   ├── ratelimit.ts           per-(command, user) cooldown
│   └── permission.ts          owner / admin / group / private gates
├── events/
│   ├── messages.ts            messages.upsert dispatcher
│   ├── connection.ts          QR, open/close, reconnect signal
│   ├── groups.ts              welcome + group upsert
│   └── calls.ts               auto-reject incoming calls
└── utils/                     jid, text, time helpers
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Scan the QR shown in the terminal, or set `USE_PAIRING_CODE=true` and `PAIRING_NUMBER=<your number>` in `.env` to receive a pairing code instead.

## Adding a command

Drop a file under `src/commands/modules/<category>/<name>.ts`. The loader picks it up at startup.

```ts
import { defineCommand } from '../../types.js'

export default defineCommand({
  name: 'hi',
  category: 'general',
  description: 'Say hello.',
  run: async ({ send, message }) => {
    await send.reply(message, `hello ${message.pushName ?? 'there'}`)
  }
})
```

Available context: `message`, `args`, `prefix`, `sock`, `send`, `logger`, `registry`.

Permissions: `everyone` (default), `private`, `group`, `admin`, `owner`. Cooldowns are per-user, in milliseconds.

## Environment

| Var | Purpose |
|---|---|
| `BOT_NAME` | Browser identifier sent to WhatsApp |
| `PREFIX` | Command prefix (default `!`) |
| `OWNERS` | Comma-separated phone numbers, no `+` |
| `SESSION_DIR` | Where credentials are persisted |
| `LOG_LEVEL` | pino log level |
| `USE_PAIRING_CODE` | Skip QR and pair via code |
| `PAIRING_NUMBER` | Phone to pair, no `+` |

## Scripts

- `npm run dev` — run with hot reload via tsx
- `npm run build` — compile to `dist/`
- `npm start` — run the compiled build

## Notes

I had contributed to open-source WhatsApp Bots like [Kaoi](https://github.com/PrajjwalDatir/Kaoi) back in 2020-2021 and these projects inspired me to come up with my own WhatsApp bot. Aze is a pretty early-stage project right now and is under heavy development, I'll be adding more features soon.

