import CommonRequest from "../commonRequest.type.ts";

export type GetQuotes = CommonRequest<undefined, undefined, { authorId: string }>;

export type PostQuote = CommonRequest<{ quote: string; sourceId: string | null; authorId: string }>;

export type PatchQuote = CommonRequest<{
  quote?: string;
  quoteId: string;
  authorId?: string;
  sourceId?: string | null;
}>;
