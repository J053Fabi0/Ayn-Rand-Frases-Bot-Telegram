import CommonRequestPartial from "../commonRequest.type.ts";

export type AuthRequest = CommonRequestPartial<undefined, { token: string }>;
