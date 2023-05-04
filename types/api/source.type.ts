import CommonRequest from "../commonRequest.type.ts";

export type GetSources = CommonRequest<undefined, undefined, { authorId: string }>;
