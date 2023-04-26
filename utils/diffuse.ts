import { sleep, _, ObjectId } from "../deps.ts";
import Author from "../types/collections/author.type.ts";
import { changeQuote, getQuotes } from "../controllers/mongo/quote.controller.ts";
import { createAuthor, getAuthors } from "../controllers/mongo/author.controller.ts";

export default async function diffuse() {
  // This is used to supress the error when ther's no code in this function.
  await sleep(0);

  await updateQuotesWithoutAuthor();

  console.log("Diffused!");
}

async function updateQuotesWithoutAuthor() {
  const maxAuthorLength = 30;
  const quotes = await getQuotes();
  const authors = await getAuthors();
  const aynRand =
    authors.find((author) => author.name === "Ayn Rand") ?? (await createAuthor({ name: "Ayn Rand" }));
  if (!authors.find((a) => a.name === "Ayn Rand")) authors.push(aynRand);

  const orphanQuotes = quotes.filter((q) => !q.author); // Only quotes without an author yet

  const orphanQuotesWithAuthor: { id: ObjectId; quote: string; author: Author | null }[] = [];
  for (const quote of orphanQuotes) {
    const lastLine = quote.quote.split("\n").slice(-1)[0];

    // If the last line is too long, it's probably not an author.
    if (lastLine.length > maxAuthorLength)
      orphanQuotesWithAuthor.push({ id: quote._id, quote: quote.quote, author: null });

    const possibleAuthorInAuthors = authors.find((author) => new RegExp(author.name, "i").test(lastLine));

    if (!possibleAuthorInAuthors) {
      const authorName = lastLine.match(/(?<=-) ?\w+ \w+/)?.[0]!.trim();

      // if no author name is found, it's probably not an author
      if (!authorName) orphanQuotesWithAuthor.push({ id: quote._id, quote: quote.quote, author: null });
      else {
        // Create a new author with the found name
        const newAuthor = await createAuthor({ name: authorName });
        authors.push(newAuthor);
        orphanQuotesWithAuthor.push({ id: quote._id, quote: quote.quote, author: newAuthor });
      }
    } else
      orphanQuotesWithAuthor.push({
        id: quote._id,
        quote: quote.quote,
        author: possibleAuthorInAuthors,
      });
  }

  for (const { author, id, quote } of orphanQuotesWithAuthor) {
    // If the quote doesn't have an author, the quote is unchanged
    // If the quote has an author, the quote is the quote without the author
    const finalQuote = author ? quote.split("\n").slice(0, -1).join("\n").trim() : quote;
    // If there's no author, it's probably Ayn Rand.
    const authorId = author ? author._id : aynRand._id;

    await changeQuote({ _id: id }, { $set: { quote: finalQuote, author: authorId } });
  }

  if (orphanQuotesWithAuthor.length > 0)
    console.log(`Updated ${orphanQuotesWithAuthor.length} quotes without author!`);
}
