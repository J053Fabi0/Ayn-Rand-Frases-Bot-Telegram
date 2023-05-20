import { sleep, _, ObjectId } from "../deps.ts";
import Author from "../types/collections/author.type.ts";
import { changeQuote, getQuotes } from "../controllers/mongo/quote.controller.ts";
import { createSource, getSource } from "../controllers/mongo/source.controller.ts";
import { createAuthor, getAuthor, getAuthors } from "../controllers/mongo/author.controller.ts";

export default async function diffuse() {
  // This is used to supress the error when ther's no code in this function.
  await sleep(0);

  await updateQuotesWithoutAuthor();
  await updateQuotesWithoutSource();

  console.log("Diffused!");
}

async function updateQuotesWithoutSource() {
  const quotes = await getQuotes({ source: { $exists: false } }, { projection: { quote: 1, source: 1 } });

  if (quotes.length === 0) return;

  // the longest source is:
  // Ayn Rand on The Tonight Show Starring Johnny Carson | Oct. 1967
  // which is 63 characters long
  const maxSourceLength = 75;

  // They must exist because this is run after updateQuotesWithoutAuthor,
  // which creates them if they don't exist.
  const aynRand = (await getAuthor({ name: "Ayn Rand" }, { projection: { _id: 1 } }))!;
  const peter = (await getAuthor({ name: "Peter Schwartz" }, { projection: { _id: 1 } }))!;

  for (const quote of quotes) {
    const [firstLine, ...rest] = quote.quote.split("\n");

    // This is the only source that is not from Ayn Rand
    const author =
      firstLine === 'In his talk "Judging Viewpoints by Their Fundamentals", minute 1:19:07.' ? peter : aynRand;

    // if the first line is too long, it's probably not a source
    if (firstLine.length > maxSourceLength) {
      await changeQuote({ _id: quote._id }, { $set: { source: null } });
    } else {
      // get or create the source
      const source =
        (await getSource({ name: firstLine }, { projection: { _id: 1 } })) ??
        (await createSource({ name: firstLine, authors: [author._id] }));

      const restOfQuote = rest.join("\n").trim();

      // update the quote
      await changeQuote({ _id: quote._id }, { $set: { source: source._id, quote: restOfQuote } });
    }
  }
}

async function updateQuotesWithoutAuthor() {
  const maxAuthorLength = 30;
  const quotes = await getQuotes({ author: { $exists: false } }, { projection: { quote: 1, author: 1 } });

  if (quotes.length === 0) return;

  const authors = await getAuthors({}, { projection: { name: 1 } });
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
