export default function trueLength(string: string) {
  return new TextEncoder().encode(string).length;
}
