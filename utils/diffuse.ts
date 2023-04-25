import { getQuotes, changeQuote } from "../controllers/quote.controller.ts";
import { changeUser, getUsers } from "../controllers/user.controller.ts";

export default async function diffuse() {
  const allUsers = await getUsers();

  for (const user of allUsers) {
    if (typeof user.createdAt === "string" || typeof user.modifiedAt === "string") {
      changeUser(
        { _id: user._id },
        {
          $set: {
            ...(typeof user.createdAt === "string" && { createdAt: new Date(user.createdAt) }),
            ...(typeof user.modifiedAt === "string" && { modifiedAt: new Date(user.modifiedAt) }),
          },
        }
      );
    }
  }

  const allQuotes = await getQuotes();

  for (const quote of allQuotes) {
    if (
      typeof quote.createdAt === "string" ||
      typeof quote.modifiedAt === "string" ||
      typeof quote.lastSentTime === "string"
    ) {
      changeQuote(
        { _id: quote._id },
        {
          $set: {
            ...(typeof quote.createdAt === "string" && { createdAt: new Date(quote.createdAt) }),
            ...(typeof quote.modifiedAt === "string" && { modifiedAt: new Date(quote.modifiedAt) }),
            ...(typeof quote.lastSentTime === "string" && { lastSentTime: new Date(quote.lastSentTime) }),
          },
        }
      );
    }
  }

  console.log("Diffused!");
}
