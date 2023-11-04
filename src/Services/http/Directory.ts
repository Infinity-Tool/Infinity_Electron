export const GetDirectoryFileHttp = async (devMode: any): Promise<any> => {
  const devUrl =
    "https://storage.cloud.google.com/infinity-compopack-dev/directory.json";
  const prodUrl =
    "https://infinity-tool.github.io/Infinity_Assets/directory.json";

  const url = devMode ? devUrl : prodUrl;

  const response = await fetch(url, {
    cache: "no-cache",
  });
  const data = await response.json();
  return data;
};
