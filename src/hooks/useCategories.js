import useSWR from "swr";
import { stringify } from "querystring";
import api from "../services/api";

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export default function useCategories(query) {
  const { data, error, mutate } = useSWR(
    "/categories?" + stringify(query),
    fetcher
  );

  const isLoading = !error && !data;
  const isError = error;

  return {
    categories: data,
    isLoading,
    isError,
    mutate,
  };
}
