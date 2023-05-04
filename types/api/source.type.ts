import CommonRequest from "../commonRequest.type.ts";

export type GetSources = CommonRequest<undefined, undefined, { authorId: string }>;

export type PostSource = CommonRequest<{ name: string; authors: string[] }>;
