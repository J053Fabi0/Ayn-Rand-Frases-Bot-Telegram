import { JSX } from "preact";

export function Container(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return <div class="py-5 px-3 mx-auto max-w-screen-md">{props.children}</div>;
}
