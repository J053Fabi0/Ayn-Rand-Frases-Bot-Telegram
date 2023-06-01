export interface State {
  authToken: string | undefined;
  authorId?: string;
  sourceId?: string;
  // This will only be set for components under /quote
  quoteExists?: boolean;
}
