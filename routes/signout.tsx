import { State } from "../types/state.type.ts";
import { Handlers, deleteCookie } from "../deps.ts";

export const handler: Handlers<undefined, State> = {
  GET() {
    const headers = new Headers();
    headers.set("location", "/");
    const resp = new Response("Logged out", { headers, status: 303 });
    deleteCookie(resp.headers, "authToken");
    return resp;
  },
};
