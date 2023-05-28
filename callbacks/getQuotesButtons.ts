import { ADMINS_IDS, WEBSITE_URL } from "../env.ts";
import { InlineKeyboard } from "../deps.ts";
import { getQuotes } from "../controllers/mongo/quote.controller.ts";

/**
 *
 * @param actualNumber El id de la frase actual
 * @param userID El userID, para saber si el usuario es admin o no y ponerle así el bote de basura
 * @param previous El id de la frase anterior
 * @param next El id de la frase siguiente
 * @returns
 */
export default async function getQuotesButtons(
  actualNumber: number,
  userID: number | string,
  previous?: number,
  next?: number
) {
  const quotes = await getQuotes({}, { projection: { number: 1 }, sort: { lastSentTime: 1 } });
  const actualIndex = quotes.findIndex(({ number }) => number === actualNumber);

  const customDirections = Boolean(previous || next);
  if (!previous) previous = quotes[actualIndex > 0 ? actualIndex - 1 : quotes.length - 1].number;
  if (!next) next = quotes[actualIndex < quotes.length - 1 ? actualIndex + 1 : 0].number;

  const adminButtons = [];
  const isAdmin = ADMINS_IDS.includes(+userID);
  if (isAdmin && actualIndex !== -1)
    adminButtons.push({ text: "🗑", callback_data: `delete_${actualNumber}_${previous}_${next}` });

  return new InlineKeyboard(
    (actualIndex !== -1 || customDirections) && quotes.length >= 2
      ? [
          [
            { text: "◀️", callback_data: `p_quote_${previous}` },
            { text: isAdmin ? `${actualNumber}` : "🌐", url: `${WEBSITE_URL}/quote/${actualNumber}` },
            ...adminButtons,
            { text: "▶️", callback_data: `n_quote_${next}` },
          ],
        ]
      : [adminButtons]
  );
}
