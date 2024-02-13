export const languages = ["es", "en"] as const;

export type language = (typeof languages)[number];

export function isLanguage(str: string): str is language {
  return languages.includes(str as language);
}
