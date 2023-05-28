import CommonRequestPartial from "../commonRequest.type.ts";

export type GetAuthors = CommonRequestPartial;

export type PostAuthor = CommonRequestPartial<{ name: string }>;

export type PatchAuthor = CommonRequestPartial<{ name: string; _id: string }>;

export type DeleteAuthor = CommonRequestPartial<undefined, undefined, { _id: string }>;
