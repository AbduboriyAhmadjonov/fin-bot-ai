# FinBot AI – Financial Helper

FinBot AI is a personal finance assistant bot built with **Node.js**, **Telegraf**, and **PostgreSQL**. It helps users track expenses and income, manage categories, and gain insights into their finances. The bot supports multilingual interactions and voice input via Google Speech-to-Text API.

## Features

- **Expense & Income Tracking:** Easily log your daily expenses and income.
- **Auto-Categorization:** Smart logic to categorize transactions automatically. (Soon)
- **Category Management:** Add, edit, and delete custom categories.
- **Voice Input:** Integrated with Google Speech-to-Text API for hands-free logging.
- **Multilingual Support:** Interact in English, Russian, or Uzbek.
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
- ffmpeg (for voice message processing)
- Google Cloud credentials (for Speech-to-Text)

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

3. **Install ffmpeg:**

   For Ubuntu/Debian:

   ```sh
   sudo apt-get update && sudo apt-get install -y ffmpeg
   ```

   For macOS:

   ```sh
   brew install ffmpeg
   ```

   For Windows:
   Download from https://ffmpeg.org/download.html or install via chocolatey:

   ```sh
   choco install ffmpeg
   ```

4. **Set up Google Cloud Speech-to-Text:**

   - Create a Google Cloud project
   - Enable the Speech-to-Text API
   - Create a service account and download the JSON key file
   - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point to this file

5. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in your credentials (Telegram Bot Token, Database URL, etc.).

6. **Run database migrations:**

   ```sh
   npx prisma migrate deploy
   ```

7. **Start the bot:**
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
