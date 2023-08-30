export const GetDirectoryFileHttp = async (): Promise<any> => {
  const response = await fetch(
    `https://infinity-tool.github.io/Infinity_Assets/directory.json`,
    {
      cache: "no-cache",
    }
  );
  const data = await response.json();
  return data;
};
