
export const ObjectKeys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[];