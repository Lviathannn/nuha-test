"use client";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { inpatientToolkit } from "./inpatient-toolkit";
import type { TInpatient } from "./inpatient-types";

type TInpatientServices = {
  queryContext: {
    page: number;
    limit: number;
    search: string;
    sort: "name" | "admissionDate";
  };
};

type TInfiniteQueryResponse = {
  data: TInpatient["Patient"][];
  nextCursor: number | null;
};

function InpatientQueryOptions(context: TInpatientServices["queryContext"]) {
  return {
    tableList: infiniteQueryOptions({
      queryKey: [
        "inpatient",
        "table",
        context.page,
        context.limit,
        context.search,
        context.sort,
      ],
      queryFn: async ({ pageParam = 1 }): Promise<TInfiniteQueryResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const page = pageParam as number;
        const limit = context.limit || 10;

        const totalItems = 50;
        let allData = inpatientToolkit().generateAllMockData(totalItems);

        if (context.sort) {
          allData = inpatientToolkit().sortData(allData, context.sort);
        }

        if (context.search) {
          const searchLower = context.search.toLowerCase();
          allData = allData.filter(
            (patient) =>
              patient.name.toLowerCase().includes(searchLower) ||
              patient.nik.includes(searchLower),
          );
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = allData.slice(startIndex, endIndex);

        const hasMore = endIndex < allData.length;
        const nextCursor = hasMore ? page + 1 : null;

        return {
          data: paginatedData,
          nextCursor,
        };
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: 1,
    }),
  };
}

export const inpatientServices = {
  queryOptions: InpatientQueryOptions,
};
