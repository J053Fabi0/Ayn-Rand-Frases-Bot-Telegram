import CommonRequest from "../commonRequest.type.ts";

export type AuthRequest = CommonRequest<undefined, { token: string }>;
