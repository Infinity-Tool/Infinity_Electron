/// Remove z from the beginning of the file name
export const removeZ = (fileName: string): string => {
  if (fileName && fileName[0].toLocaleLowerCase() === "z") {
    return fileName.slice(1);
  }
  return fileName;
};
