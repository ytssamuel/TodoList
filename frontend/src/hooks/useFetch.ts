import { useState } from "react";

export function useFetch<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (fn: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || "發生錯誤");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, execute };
}

export function useMutation<T, P = void>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (fn: (params: P) => Promise<T>, params: P): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn(params);
      return result;
    } catch (err: any) {
      setError(err.message || "發生錯誤");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, mutate };
}
