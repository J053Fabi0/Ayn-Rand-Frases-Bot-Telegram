const isMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);
export default isMongoId;
