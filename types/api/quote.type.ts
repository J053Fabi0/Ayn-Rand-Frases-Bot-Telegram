import CommonRequest from "../commonRequest.type.ts";

export type GetQuotes = CommonRequest<undefined, undefined, { authorId: string }>;
