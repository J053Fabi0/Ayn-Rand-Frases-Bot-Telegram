import { Bot } from "../deps.ts";
import quote from "./quoteCallback.ts";
import deleteQ from "./deleteCallback.ts";

export default function callbacks(bot: Bot) {
  quote(bot);
  deleteQ(bot);

  bot.callbackQuery("void", (ctx) => void ctx.answerCallbackQuery().catch(console.error));

  // Answer all unknown button events
  bot.on("callback_query:data", (ctx) => {
    console.log("Unknown button event with payload", ctx.callbackQuery.data);
    ctx.answerCallbackQuery().catch(console.error);
  });
}
