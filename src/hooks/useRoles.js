import useSWR from "swr";
import { stringify } from "querystring";
import api from "../services/api";

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export default function useRoles(query) {
  const { data, error, mutate } = useSWR("/roles?" + stringify(query), fetcher);

  const isLoading = !error && !data;
  const isError = error;

  return {
    roles: data,
    isLoading,
    isError,
    mutate,
  };
}
