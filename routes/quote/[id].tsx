import { PageProps } from "$fresh/server.ts";

export default function Greet(props: PageProps) {
  return <div>{props.params.id}</div>;
}
