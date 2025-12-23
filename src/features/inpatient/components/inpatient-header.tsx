"use client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type LucideIcon, TrendingUpIcon, UserIcon } from "lucide-react";
import { inpatientServices } from "../inpatient-service";
import { useInpatientStore } from "../inpatient-store";
import { inpatientToolkit } from "../inpatient-toolkit";

dayjs.locale("id");

/**
 * ================================================================================
 * Main Component
 * ================================================================================
 */

export function InpatientHeader() {
  const { tableList } = inpatientServices.queryOptions({
    page: 1,
    limit: 50,
    search: "",
    sort: "name",
  });

  const patientQuery = useInfiniteQuery(tableList);

  const totalPatients = patientQuery.data?.pages[0]?.data.length || 0;
  const totalCostEstimate =
    patientQuery.data?.pages[0]?.data.reduce(
      (acc, curr) => acc + curr.costEstimate,
      0,
    ) || 0;

  return (
    <div className="grid grid-cols-2 gap-5 w-full">
      <InpatientHeaderItem
        title="Total Pasien Masuk"
        value={totalPatients.toString()}
        Icon={UserIcon}
      />
      <InpatientHeaderItem
        title="Estimasi Biaya Rawat Inap"
        value={inpatientToolkit().formatCurrency(totalCostEstimate)}
        Icon={TrendingUpIcon}
      />
    </div>
  );
}

/**
 * ================================================================================
 * Sub Component
 * ================================================================================
 */

type TInpatientHeaderItem = {
  title: string;
  value: string;
  Icon: LucideIcon;
};

function InpatientHeaderItem({ title, value, Icon }: TInpatientHeaderItem) {
  const { states } = useInpatientStore();

  return (
    <div className="col-span-1">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-primary">{title}</h3>

        <div className="flex items-center gap-4">
          <Icon className="w-8 h-8" color="#00B8A7" />

          <p className="text-4xl font-semibold">{value}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          {dayjs(states.filter.startDate).format("DD MMMM YYYY")} -{" "}
          {dayjs(states.filter.endDate).format("DD MMMM YYYY")}
        </p>
      </div>
    </div>
  );
}
