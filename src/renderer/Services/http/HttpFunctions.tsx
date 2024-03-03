// const headers = {
//   "Access-Control-Allow-Origin": "*",
// };

import { UseQueryResult, useQuery } from 'react-query';
import { useHttpContext } from './HttpContext';
import axios, { AxiosRequestConfig } from 'axios';

const noCacheHeaders: AxiosRequestConfig = {
  headers: {
    'Cache-Control': 'no-cache',
  },
};

export const AgreementQuery = (): UseQueryResult<any, unknown> => {
  const { baseUrl } = useHttpContext();
  const query = useQuery(
    `${baseUrl}_agreement`,
    () => {
      const url = `${baseUrl}/user_agreement.txt`;
      return axios.get(url, noCacheHeaders).then((res) => res.data);
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
    `${baseUrl}_directory`,
    () => {
      const url = `${baseUrl}/directory.json`;
      return axios.get(url, noCacheHeaders).then((res) => res.data);
    },
    {
      staleTime: Infinity,
      retry: false,
    },
  );

  return query;
};

export const GetAnnouncementQuery = (
  announcementType: AnnouncementType,
): UseQueryResult<any, unknown> => {
  const { baseUrl } = useHttpContext();
  const query = useQuery(
    `${baseUrl}_announcement_${announcementType}`,
    () => {
      const url = `${baseUrl}/Announcements/${announcementType}.txt`;
      return axios.get(url, noCacheHeaders).then((res) => res.data);
    },
    {
      staleTime: Infinity,
      retry: false,
    },
  );

  return query;
};

export const enum AnnouncementType {
  error = 'error',
  info = 'info',
  success = 'success',
  warning = 'warning',
}
