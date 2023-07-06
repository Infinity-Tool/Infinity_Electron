const folderKeyWords = ["7days", "prefabs", "mods", "die", "7d"];
const blacklistKeyworks = ["system32"]; //TODO

export const IsOkayPath = (path: string): boolean => {
  if (path == null || path === "") return false;

  const lowerCasePath = path.toLowerCase();
  var isValidPath = folderKeyWords.some((word) => lowerCasePath.includes(word));
  return isValidPath;
};

//TODO
// class ValidPathResult {
//   constructor(isValid: boolean, message: string) {}
// }
