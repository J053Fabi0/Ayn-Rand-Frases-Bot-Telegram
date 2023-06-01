export default function isMongoId(id: string) {
  return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}
