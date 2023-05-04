import CommonRequest from "../commonRequest.type.ts";

export type GetSources = CommonRequest<undefined, undefined, { authorId: string }>;

export type PostSource = CommonRequest<{ name: string; authors: string[] }>;

export type PatchSource = CommonRequest<{ name?: string; authors?: string[]; sourceId: string }>;

export type DeleteSource = CommonRequest<undefined, undefined, { _id: string }>;
