/// Remove z from the beginning of the file name
export const RemoveZ = (fileName: string): string => {
  if (fileName && fileName[0].toLocaleLowerCase() === "z") {
    return fileName.slice(1);
  }
  return fileName;
};

export const ProperCase = (tag: string) => {
  return tag.replace("_", " ").replace(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
