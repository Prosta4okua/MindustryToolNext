import { AxiosInstance } from 'axios';

import useClientAPI from '@/hooks/use-client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';

import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';

export default function useInfinitePageQuery<T, P extends PaginationQuery>(
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>,
  params: P,
  queryKey: QueryKey,
) {
  const { axios, enabled } = useClientAPI();

  const getNextPageParam = (
    lastPage: T[],
    allPages: T[][],
    lastPageParams: P,
    allPageParams: P[],
  ) => {
    if (lastPage.length === 0 || lastPage.length < params.items) {
      return undefined;
    }

    return { ...lastPageParams, page: allPages.length };
  };

  const getPreviousPageParam = (
    lastPage: T[],
    allPages: T[][],
    lastPageParams: P,
    allPageParams: P[],
  ) => {
    if (
      lastPageParams.page <= 0 ||
      lastPage.length === 0 ||
      lastPage.length < params.items
    ) {
      return undefined;
    }

    return { ...lastPageParams, page: allPages.length - 1 };
  };

  const { page, items, ...rest } = params;

  return useInfiniteQuery<T[], Error, InfiniteData<T[], P>, QueryKey, P>({
    queryKey: [...queryKey, rest],
    initialPageParam: params,
    // @ts-ignore
    queryFn: (context) => getFunc(axios, context.pageParam),
    getNextPageParam,
    getPreviousPageParam,
    enabled,
  });
}
