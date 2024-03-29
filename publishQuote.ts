import bot from "./initBot.ts";
import { ObjectId } from "./deps.ts";
import publishToMastodon from "./utils/publishToMastodon.ts";
import getQuotesButtons from "./callbacks/getQuotesButtons.ts";
import sendMassiveMessage from "./utils/sendMassiveMessage.ts";
import { changeQuote, getFullQuote, getQuote, parseFullQuote } from "./controllers/mongo/quote.controller.ts";

interface CommonParams {
  id?: string | ObjectId;
}
interface ParamsChat extends CommonParams {
  chatID: number | string;
  chatType: "group" | "supergroup" | "private";
}
interface ParamsNoChat extends CommonParams {
  chatID?: undefined;
  chatType?: undefined;
}
type Params = ParamsChat | ParamsNoChat;

export default async function publishQuote({ id, chatID, chatType }: Params = {}) {
  const query: { _id?: ObjectId } = {};
  if (id) {
    query._id = new ObjectId(id);
  } else if (chatID === undefined) {
    // Si se está publicando a todos se envía siguiente la que tenga menos tiempo de haber sido enviada
    query._id = (await getQuote(
      { archived: { $ne: true } },
      { sort: { lastSentTime: 1 }, projection: { _id: 1 } }
    ))!._id;
  }
  // Si es usando el comando /frase, se intenciona compartir la última que se envió
  else
    query._id = (await getQuote(
      { archived: { $ne: true } },
      { sort: { lastSentTime: -1 }, projection: { _id: -1 } }
    ))!._id;

  const possibleQuote = await getFullQuote(query);

  if (possibleQuote === null) {
    if (chatID === undefined) return;
    return bot.api.sendMessage(chatID, "No hay frases para compartir.").catch(() => {});
  }

  const fullQuote = parseFullQuote(possibleQuote, true);

  if (chatID)
    return bot.api
      .sendMessage(chatID, fullQuote, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup:
          possibleQuote.number && chatType === "private"
            ? await getQuotesButtons(possibleQuote.number, chatID)
            : undefined,
      })
      .catch(() => {});

  await sendMassiveMessage(fullQuote, undefined, {
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
  });
  try {
    const { quote, extras } = parseFullQuote(possibleQuote, false);
    await publishToMastodon(quote, extras, possibleQuote.language);
  } catch (e) {
    console.error(e);
  }

  await changeQuote({ _id: possibleQuote._id }, { $set: { lastSentTime: new Date() }, $inc: { timesSent: 1 } });
}
