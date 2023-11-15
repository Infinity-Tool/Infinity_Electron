export const GetDirectoryFileHttp = async (baseUrl: string): Promise<any> => {
  const url = `${baseUrl}/directory.json`;

  const response = await fetch(url, {
    cache: "no-cache",
  });
  const data = await response.json();
  return data;
};
