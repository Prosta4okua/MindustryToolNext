import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

let timeout: any;

export default function useQueryState(initialState: Record<string, string>) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentValue, setCurrentValue] = useState(initialState);

  useEffect(() => {
    const result: Record<string, string> = {};

    for (const key of params.keys()) {
      const value = params.get(key);
      if (value !== undefined && value !== null) {
        result[key] = value;
      }
    }

    setCurrentValue(result);
  }, [params]);

  useEffect(() => {
    const queryParams = new URLSearchParams();

    Object.entries(initialState)
      .filter(([_, value]) => value)
      .forEach(([key, value]) => queryParams.set(key, value));

    navigate(queryParams);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setter = useCallback(
    (value: Record<string, string | undefined>) => {
      const queryParams = new URLSearchParams(params);

      const filteredValue = Object.fromEntries(Object.entries(value).filter(([_, value]) => value !== undefined)) as Record<string, string>;

      setCurrentValue(filteredValue);

      Object.entries(value).forEach(([key, value]) => {
        if (value !== undefined) queryParams.set(key, value);
        else queryParams.delete(key);
      });

      navigate(queryParams);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, router],
  );

  function navigate(queryParams: URLSearchParams) {
    if (timeout) {
      clearTimeout(timeout);
    }

    let isTheSame = true;

    for (const key of queryParams.keys()) {
      if (params.get(key) !== queryParams.get(key)) {
        isTheSame = false;
      }
    }

    if (!isTheSame) {
      timeout = setTimeout(() => router.replace(`${pathname}?${queryParams.toString()}`), 1000);
    }
  }

  let result = Object.fromEntries(params.entries());

  Object.entries(currentValue).forEach(([key, value]) => {
    result[key] = value;
  });

  Object.entries(result).forEach(([key, value]) => {
    if (!value) {
      delete result[key];
    }
  });

  result = { ...initialState, ...result };

  return [result, setter] as const;
}
