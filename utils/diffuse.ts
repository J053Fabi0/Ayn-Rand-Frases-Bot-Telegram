import { sleep } from "https://deno.land/x/sleep@v1.2.1/sleep.ts";

export default async function diffuse() {
  // Nothing to diffuse for now
  await sleep(0);

  console.log("Diffused!");
}
