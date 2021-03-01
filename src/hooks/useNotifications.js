import useSWR from "swr";
import { stringify } from "querystring";
import api from "../services/api";

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export default function useNotifications(query) {
  const { data, error, mutate } = useSWR(
    "/notifications?" + stringify(query),
    fetcher
  );

  const { notifications, total, page, totalPages, limit } = data || {};
  const isLoading = !error && !data;
  const isError = error;

  return {
    notifications,
    total,
    page,
    totalPages,
    limit,
    isLoading,
    isError,
    mutate,
  };
}
