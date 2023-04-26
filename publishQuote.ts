import bot from "./initBot.ts";
import { ObjectId } from "./deps.ts";
import getQuotesButtons from "./callbacks/getQuotesButtons.ts";
import sendMassiveMessage from "./utils/sendMassiveMessage.ts";
import { aggregateQuote, changeQuote, getQuotes } from "./controllers/mongo/quote.controller.ts";

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
  const query: { _id?: ObjectId; timesSent?: number } = {};
  if (id) {
    query._id = new ObjectId(id);
  } else if (chatID === undefined) {
    query.timesSent =
      (await aggregateQuote([{ $group: { _id: null, timesSent: { $min: "$timesSent" } } }]))[0]?.timesSent ?? 0;
  }

  const quotes = await getQuotes(query, {
    sort: chatID === undefined ? { lastSentTime: 1 } : { lastSentTime: -1 },
    projection: { quote: 1, number: 1, _id: 1 },
    limit: 1,
  });
  // Si se está publicando a todos se envía siguiente la que tenga menos tiempo de haber sido enviada y
  // que tenga el número menor de vecesEnviada.
  // Si es usando el comando /frase, se intenciona compartir la última que se envió, así que se invierte el órden.

  const { quote = "No hay frases.", number = undefined } = quotes[0] ?? {};

  if (chatID)
    bot.api
      .sendMessage(
        chatID,
        quote,
        number && chatType === "private" ? { reply_markup: await getQuotesButtons(number, chatID) } : undefined
      )
      .catch(() => {});
  else await sendMassiveMessage(quote);

  if (quotes.length === 0 || chatID) return;

  await changeQuote({ _id: quotes[0]._id }, { $set: { lastSentTime: new Date() }, $inc: { timesSent: 1 } });
}
