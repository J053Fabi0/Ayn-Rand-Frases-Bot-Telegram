# Objectivism quotes bot and website

This is a Telegram bot that sends quotes from Objectivist books, articles and videos. It also has a website where
you can see the quotes and search for them.

Subscribe to the Telegram bot: [@FrasesDeAynRandBot](https://t.me/FrasesDeAynRandBot).

Checkout the website [aynrand.josefabio.com](https://aynrand.josefabio.com).

# Host your own bot and website

## Requirements

- `deno`. Find the installation instructions at [deno.land](https://deno.land/).

## `.env`

- `WEB_PORT` The port on which the front-end will run.
- `API_PORT` The port on which the API will run.
- `AUTH_TOKEN` The secret token that will be used to authenticate requests. Use any secure password.
- `ADMINS_IDS` The ids of the administrators who will be able to use it privately. You can obtain them with
  [@userinfobot](https://t.me/userinfobot). Separate the ids with commas, without spaces.
- `BOT_TOKEN` The bot's token. You can create a bot with [@BotFather](https://t.me/BotFather).
- `MONGO_URI` The URI of the MongoDB database. You can create a free database at
  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- `PUBLICATION_HOUR` The hour at which the bot will send the quotes. It's just the hour, a simple number from 0
  to 23.
- `TIMEZONE` The timezone of the bot. You can find the list of timezones at
  [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).

## Running the bot

Copy the `constants.example.ts` file to `constants.ts` and modify, if you want, the sending time.

Copy the `.env.example` file to `.env` and modify the environment variables.

To run the bot, execute `deno task run`.

To see the possible commands, execute `deno task`.
