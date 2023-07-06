export const GetAgreementHttp = async (): Promise<any> => {
  const response = await fetch(
    `https://infinity-tool.github.io/Infinity_Assets/user_agreement.txt`
  );
  const data = await response.text();
  return data;
};
