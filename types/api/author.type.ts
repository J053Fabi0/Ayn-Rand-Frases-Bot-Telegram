import CommonRequest from "../commonRequest.type.ts";

export type GetAuthors = CommonRequest;

export type PostAuthor = CommonRequest<{ name: string }>;
