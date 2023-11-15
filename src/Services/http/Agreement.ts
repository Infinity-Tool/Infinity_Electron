export const GetAgreementHttp = async (baseUrl: string): Promise<any> => {
  const url = `${baseUrl}/user_agreement.txt`;

  const response = await fetch(url);
  const data = await response.text();
  return data;
};
