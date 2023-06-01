import CommonRequestPartial from "../commonRequest.type.ts";

export type GetQuotes = CommonRequestPartial<undefined, undefined, { authorId: string }>;

export type PostQuote = CommonRequestPartial<{ quote: string; sourceId: string | null; authorId: string }>;

export type PatchQuote = CommonRequestPartial<
  {
    quote?: string;
    archived?: false;
    authorId?: string;
    sourceId?: string | null;
  } & (
    | { quoteId?: never; number: number }
    // Either quoteId or number must be provided, but not both
    | { quoteId: string; number?: never }
  )
>;

export type DeleteQuote = CommonRequestPartial<undefined, undefined, { idOrNumber: string }>;
