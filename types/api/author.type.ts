import CommonRequest from "../commonRequest.type.ts";

export type GetAuthors = CommonRequest;

export type PostAuthor = CommonRequest<{ name: string }>;

export type PatchAuthor = CommonRequest<{ name: string; _id: string }>;
