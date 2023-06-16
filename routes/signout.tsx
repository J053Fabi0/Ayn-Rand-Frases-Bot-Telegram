import { Handlers } from "../deps.ts";
import redirect from "../utils/redirect.ts";
import { State } from "../types/state.type.ts";

export const handler: Handlers<undefined, State> = {
  GET(_, ctx) {
    ctx.state.session.set("authToken", null);
    return redirect("/");
  },
};
