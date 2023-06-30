const folderKeyWords = ["7days", "prefabs", "mods", "die", "7d"];
const blacklistKeyworks = ["system32"];

export const IsOkayPath = (path: string): boolean => {
  if (path == null || path === "") return false;

  const lowerCasePath = path.toLowerCase();
  var isValidPath = folderKeyWords.some((word) => lowerCasePath.includes(word));

  //&&  !blacklistKeyworks.((blacklist) => lowerCasePath.includes(blacklist))
  return isValidPath;
};

//TODO
// class ValidPathResult {
//   constructor(isValid: boolean, message: string) {}
// }
