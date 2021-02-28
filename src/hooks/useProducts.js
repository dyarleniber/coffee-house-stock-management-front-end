import useSWR from "swr";
import { stringify } from "querystring";
import api from "../services/api";

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export default function useProducts(query) {
  const { data, error, mutate } = useSWR(
    "/products?" + stringify(query),
    fetcher
  );

  const { products, total, page, totalPages, limit } = data || {};
  const isLoading = !error && !data;
  const isError = error;

  return {
    products,
    total,
    page,
    totalPages,
    limit,
    isLoading,
    isError,
    mutate,
  };
}
