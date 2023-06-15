import redirect from "../utils/redirect.ts";
import { State } from "../types/state.type.ts";
import { Handlers, deleteCookie } from "../deps.ts";

export const handler: Handlers<undefined, State> = {
  GET() {
    const response = redirect("/");
    deleteCookie(response.headers, "authToken");
    return response;
  },
};
