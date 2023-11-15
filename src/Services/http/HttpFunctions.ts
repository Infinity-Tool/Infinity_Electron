// const headers = {
//   "Access-Control-Allow-Origin": "*",
// };

const fetchOptions: any = {
  headers: {
    "Content-Type": "application/octet-stream",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
  },
};

export const GetAgreementHttp = async (baseUrl: string): Promise<any> => {
  const url = `${baseUrl}/user_agreement.txt`;

  const response = await fetch(url, fetchOptions);
  const data = await response.text();
  return data;
};

export const GetDirectoryFileHttp = async (baseUrl: string): Promise<any> => {
  const url = `${baseUrl}/directory.json`;

  const response = await fetch(url, fetchOptions);
  const data = await response.json();
  return data;
};
