<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

---

## 📖 Description

This is a **Discord bot** for the **Corpa guild**, written in **TypeScript** with **NestJS** and **Discord.js**.  

### ✨ Features
- 🔧** Channel generator** - automatically creates voice channel and you become owner
- 🎛 **Channel control panel** – manage generated channels with ease.
---
## Project setup

install yarn globally (if not installed)
```bash
$ npm install -g yarn
```
install project dependencies
```bash
yarn install
```
Create a .env file in the project root with the following variables:
```.env
 DS_TOKEN=your_discord_bot_token
 GUILD_ID=your_discord_guild_id
 PORT=5050 # default
```

## 🚀 Running the App

Follow the steps below to run the project in **production** or **development** mode.

---

### 🏭 Production Mode

1. **Build the project:**
```bash
yarn build
```
2. **Run the production server:**
```bash
yarn start:prod
```

### 🔧 Development Mode
**Run the app in watch mode (auto-reload on changes)**
```bash
yarn start:dev
```

## 🛠 Tech Stack

### Frameworks & Libraries
- **[NestJS](https://nestjs.com/)** – server-side framework for scalable applications
- **[Discord.js](https://discord.js.org/)** – Discord API wrapper
- **[@discord-nestjs/core](https://www.npmjs.com/package/@discord-nestjs/core)** – NestJS integration for Discord
- **[@discord-nestjs/common](https://www.npmjs.com/package/@discord-nestjs/common)** – common utilities for Discord-NestJS
- **[TypeORM](https://typeorm.io/)** – ORM for database interactions
- **[better-sqlite3](https://www.npmjs.com/package/better-sqlite3)** – SQLite client
- **[nest-winston](https://www.npmjs.com/package/nest-winston)** + **[winston](https://www.npmjs.com/package/winston)** – logging

### Core & Utilities
- **TypeScript** – type-safe JavaScript
- **nestjs-dynamic-providers** – dynamic dependency injection support


---
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
