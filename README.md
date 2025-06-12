# FinBot AI – Financial Helper

FinBot AI is a personal finance assistant bot built with **Node.js**, **Telegraf**, and **PostgreSQL**. It helps users track expenses and income, manage categories, and gain insights into their finances. The bot supports multilingual interactions and voice input via Google Speech-to-Text API.

## Features

- **Expense & Income Tracking:** Easily log your daily expenses and income.
- **Auto-Categorization:** Smart logic to categorize transactions automatically. (Soon)
- **Category Management:** Add, edit, and delete custom categories.
- **Voice Input:** Integrated with Google Speech-to-Text API for hands-free logging. (Soon)
- **Multilingual Support:** Interact in multiple languages. (Soon)
- **Insights & Summaries:** Get summaries and insights about your spending.
- **Service-Based Architecture:** Clean, maintainable code structure.

## Tech Stack

- **Node.js**
- **Telegraf** (Telegram Bot Framework)
- **PostgreSQL** (via Prisma ORM)
- **Google Speech-to-Text API**

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/finbot-ai.git
   cd finbot-ai
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in your credentials (Telegram Bot Token, Google API Key, Database URL, etc.).

4. **Run database migrations:**

   ```sh
   npx prisma migrate deploy
   ```

5. **Start the bot:**
   ```sh
   npm start
   ```

### Docker

To run with Docker:

```sh
docker build -t finbot-ai .
docker run --env-file .env finbot-ai
```

## Project Structure

- `src/` – Main source code (commands, handlers, services, etc.)
- `prisma/` – Prisma schema and migrations
- `.env` – Environment variables

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---

**FinBot AI** – Smarter money management, right in your chat.
