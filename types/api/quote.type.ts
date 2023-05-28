import CommonRequestPartial from "../commonRequest.type.ts";

export type GetQuotes = CommonRequestPartial<undefined, undefined, { authorId: string }>;

export type PostQuote = CommonRequestPartial<{ quote: string; sourceId: string | null; authorId: string }>;

export type PatchQuote = CommonRequestPartial<{
  quote?: string;
  quoteId: string;
  archived?: false;
  authorId?: string;
  sourceId?: string | null;
}>;

export type DeleteQuote = CommonRequestPartial<undefined, undefined, { _id: string }>;
