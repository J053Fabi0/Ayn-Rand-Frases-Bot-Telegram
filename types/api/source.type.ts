import CommonRequestPartial from "../commonRequest.type.ts";

export type GetSources = CommonRequestPartial<undefined, undefined, { authorId: string }>;

export type PostSource = CommonRequestPartial<{ name: string; authors: string[] }>;

export type PatchSource = CommonRequestPartial<{ name?: string; authors?: string[]; sourceId: string }>;

export type DeleteSource = CommonRequestPartial<undefined, undefined, { _id: string }>;
