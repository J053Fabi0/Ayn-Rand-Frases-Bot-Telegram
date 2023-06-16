import { WithSession } from "../deps.ts";

export interface State extends WithSession {
  authToken: string | undefined;
  authorId?: string;
  sourceId?: string;
  // This will only be set for components under /quote
  quoteExists?: boolean;
}
