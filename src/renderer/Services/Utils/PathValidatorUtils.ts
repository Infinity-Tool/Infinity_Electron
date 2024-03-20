/* eslint-disable import/prefer-default-export */
const validKeywords = ['7days', 'prefabs', 'mods', 'die', '7d'];
const invalidKeywords = ['system32', 'c:/windows'];

export const IsOkayPath = (path: string | null): boolean => {
  if (path == null || path === '') return false;

  const lowerCasePath = path.toLocaleLowerCase();
  const isValidPath = validKeywords.some((word) =>
    lowerCasePath.includes(word),
  );

  const isInvalidPath =
    invalidKeywords.some((word) => lowerCasePath.includes(word)) ||
    lowerCasePath == 'c:' ||
    lowerCasePath == 'c:\\' ||
    lowerCasePath == 'c:\\windows' ||
    lowerCasePath == 'c:\\program files' ||
    lowerCasePath == 'c:\\program files (x86)';

  return isValidPath && !isInvalidPath;
};
