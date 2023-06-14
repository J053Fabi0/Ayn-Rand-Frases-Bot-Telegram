export default function isMongoId(id: unknown) {
  return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}
