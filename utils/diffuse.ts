import { sleep } from "../deps.ts";

export default async function diffuse() {
  // This is used to supress the error when ther's no code in this function.
  await sleep(0);

  console.log("Diffused!");
}
