/** RequiredUnion is like Required but lets you choose which keys to make required. */
type RequiredUnion<T, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export default RequiredUnion;
