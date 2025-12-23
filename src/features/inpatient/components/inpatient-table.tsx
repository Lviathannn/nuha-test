"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { FileIcon } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { inpatientServices, useInpatientStore } from "@/features/inpatient";
import { cn } from "@/lib/utils";

/**
 * ================================================================================
 * Main Component
 * ================================================================================
 */

export function InpatientTable() {
  const { states } = useInpatientStore();
  const { tableList } = inpatientServices.queryOptions({
    page: 1,
    limit: 10,
    search: states.filter.search || "",
    sort: states.filter.sort || "name",
  });

  const patientQuery = useInfiniteQuery(tableList);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (inView) {
      patientQuery.fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="max-h-[470px] overflow-y-auto relative">
      <Table>
        <TableHeader className="sticky bg-zinc-50 h-12">
          <TableRow>
            <TableHead className="w-[50px] max-w-[50px]">No</TableHead>

            <TableHead className="w-[150px] max-w-[150px]">Nama</TableHead>

            <TableHead className="w-[100px] max-w-[100px]">NIK</TableHead>

            <TableHead className="w-[100px] max-w-[100px]">Ruangan</TableHead>

            <TableHead className="w-[100px] max-w-[100px]">Diagnosa</TableHead>

            <TableHead className="w-[100px] max-w-[100px]">Status</TableHead>

            <TableHead className="w-[100px] max-w-[100px]">
              Tanggal Masuk
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patientQuery.isLoading && (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={8} className="h-[450px] text-center">
                <div className="flex h-full items-center justify-center">
                  <Spinner className="w-10 h-10" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {patientQuery.data?.pages[0]?.data.length === 0 && (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={8} className="h-[400px] text-center">
                <EmptyTable />
              </TableCell>
            </TableRow>
          )}

          {patientQuery.data?.pages
            .flatMap((page) => page.data)
            .map((patient, index) => (
              <TableRow key={patient.id} className="py-4 h-16">
                <TableCell className="font-medium w-[50px] max-w-[50px]">
                  {index + 1}
                </TableCell>

                <TableCell className="w-[150px] max-w-[150px]">
                  {patient.name}
                </TableCell>

                <TableCell className="w-[100px] max-w-[100px]">
                  {patient.nik}
                </TableCell>

                <TableCell className="w-[100px] max-w-[100px]">
                  {patient.room}
                </TableCell>

                <TableCell className="w-[100px] max-w-[100px]">
                  {patient.diagnosis}
                </TableCell>

                <TableCell className="w-[100px] max-w-[100px]">
                  <StatusBadge status={patient.status} />
                </TableCell>

                <TableCell className="w-[100px] max-w-[100px]">
                  {dayjs(patient.admissionDate).format("DD MMMM YYYY")}
                </TableCell>
              </TableRow>
            ))}

          {patientQuery.isFetchingNextPage && (
            <TableRow className="hover:bg-white">
              <TableCell colSpan={8} className="h-16 text-center">
                <div className="flex h-full items-center justify-center">
                  <Spinner className="w-6 h-6" />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <span ref={ref} />
    </div>
  );
}

/**
 * ================================================================================
 * Sub Component
 * ================================================================================
 */

function EmptyTable() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileIcon />
        </EmptyMedia>
        <EmptyTitle>Data Pasien Kosong</EmptyTitle>
        <EmptyDescription>Data pasien masuk tidak ditemukan.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

const badgeVariant = {
  warning: "bg-yellow-500",
  normal: "bg-green-500",
  critical: "bg-red-500",
};

type TStatusBadge = {
  status: keyof typeof badgeVariant;
};

function StatusBadge({ status }: TStatusBadge) {
  return (
    <Badge className={cn(badgeVariant[status], "w-16 capitalize")}>
      {status}
    </Badge>
  );
}
