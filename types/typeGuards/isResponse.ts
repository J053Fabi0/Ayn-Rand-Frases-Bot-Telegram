export default function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}
