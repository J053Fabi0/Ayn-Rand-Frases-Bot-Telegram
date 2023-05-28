interface Options {
  headers?: Headers;
  body?: BodyInit;
  statusText?: string;
}

export default function redirect(location: string, { headers = new Headers(), body, statusText }: Options = {}) {
  headers.set("location", location);
  return new Response(body, { status: 303, headers, statusText });
}
