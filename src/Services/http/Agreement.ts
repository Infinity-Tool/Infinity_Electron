export const GetAgreementHttp = async (devMode: any): Promise<any> => {
  const devUrl =
    "https://storage.cloud.google.com/infinity-compopack-dev/user_agreement.txt";
  const prodUrl =
    "https://infinity-tool.github.io/Infinity_Assets/user_agreement.txt";

  const url = devMode ? devUrl : prodUrl;

  const response = await fetch(url);
  const data = await response.text();
  return data;
};
