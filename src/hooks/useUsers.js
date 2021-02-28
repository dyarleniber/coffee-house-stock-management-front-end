import useSWR from "swr";
import { stringify } from "querystring";
import api from "../services/api";

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export default function useUsers(query) {
  const { data, error, mutate } = useSWR("/users?" + stringify(query), fetcher);

  const { users, total, page, totalPages, limit } = data || {};
  const isLoading = !error && !data;
  const isError = error;

  return {
    users,
    total,
    page,
    totalPages,
    limit,
    isLoading,
    isError,
    mutate,
  };
}
