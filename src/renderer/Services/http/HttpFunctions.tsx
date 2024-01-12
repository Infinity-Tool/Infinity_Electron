// const headers = {
//   "Access-Control-Allow-Origin": "*",
// };

import { UseQueryResult, useQuery } from 'react-query';
import { useHttpContext } from './HttpContext';
import axios from 'axios';

const fetchOptions: any = {
  headers: {
    'Content-Type': 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
  },
};

export const AgreementQuery = (): UseQueryResult<any, unknown> => {
  const { baseUrl } = useHttpContext();
  const query = useQuery(
    'agreement',
    () => {
      const url = `${baseUrl}/user_agreement.txt`;
      return axios.get(url).then((res) => res.data);
    },
    {
      staleTime: Infinity,
      retry: false,
    },
  );

  return query;
};

export const GetDirectoryFileQuery = (): UseQueryResult<any, unknown> => {
  const { baseUrl } = useHttpContext();
  const query = useQuery(
    'directory',
    () => {
      const url = `${baseUrl}/directory.json`;
      return axios.get(url, fetchOptions).then((res) => res.data);
    },
    {
      staleTime: Infinity,
      retry: false,
    },
  );

  return query;
};
