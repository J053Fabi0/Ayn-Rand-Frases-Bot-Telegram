import masto from "./masto.ts";

interface Part {
  text: string;
  truncated: boolean;
  extras: string | null;
}

function getFullQuoteFromPart(part: Part) {
  let fullQuote = part.text;
  if (part.truncated) {
    // delete the last "," or "."
    fullQuote = fullQuote.replace(/[,\.]$/, "");
    fullQuote += "…";
  }
  if (part.extras) fullQuote += part.extras;
  return fullQuote;
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type CreateStatusParams = Writeable<Parameters<typeof masto.v1.statuses.create>[0]>;

export default async function publishToMastodon(quote: string, extras: string) {
  const words = quote.split(" ");
  const parts: Part[] = [{ extras, text: words.shift()!, truncated: true }];

  for (let partIndex = 0; ; ) {
    const part = parts[partIndex];
    const word = words.shift();

    // if there are no more words, the last part is complete
    if (word === undefined) {
      part.truncated = false;
      break;
    }

    // add a word to the part
    const partCopy = { ...part };
    partCopy.text += " " + word;

    // and test if the new quote is too long
    const newFullQuote = getFullQuoteFromPart(partCopy);
    // it's 499 because I want to be able to add an "…" at the beginning of the next part
    if (newFullQuote.length > 499) {
      // if it is, then the part is complete
      partIndex++;
      // and the word is added to the next part
      parts.push({ extras: null, text: word, truncated: true });
    }
    // if it is not, then the part is updated
    else part.text = partCopy.text;
  }

  const { length } = parts;
  const createStatusParams: CreateStatusParams = { status: "", visibility: "public" };
  for (let i = 0; i < length; i++) {
    const part = parts[i];
    createStatusParams.status = (i >= 1 ? "…" : "") + getFullQuoteFromPart(part);
    const post = await masto.v1.statuses.create(createStatusParams);
    if (!createStatusParams.inReplyToId) {
      createStatusParams.inReplyToId = post.id;
      createStatusParams.visibility = "unlisted";
    }
  }
}
