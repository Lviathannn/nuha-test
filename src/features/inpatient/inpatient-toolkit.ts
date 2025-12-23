"use client";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import type { TInpatient } from "./inpatient-types";

export function inpatientToolkit() {
  function generateMockInpatient(): TInpatient["Patient"] {
    const statuses: TInpatient["Patient"]["status"][] = [
      "warning",
      "normal",
      "critical",
    ];
    const admissionDate = faker.date.past({ years: 1 });

    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      nik: faker.string.numeric(16),
      room: faker.string.numeric(3),
      diagnosis: faker.helpers.arrayElement([
        "Hypertension",
        "Diabetes",
        "Pneumonia",
        "Fracture",
        "Appendicitis",
        "Gastritis",
        "Bronchitis",
      ]),
      costEstimate: faker.number.int({ min: 100000, max: 1000000 }),
      status: faker.helpers.arrayElement(statuses),
      admissionDate: admissionDate.toISOString().split("T")[0],
    };
  }

  function generateAllMockData(totalItems: number): TInpatient["Patient"][] {
    const toolkit = inpatientToolkit();
    return Array.from({ length: totalItems }, () => {
      return toolkit.generateMockInpatient();
    });
  }

  function sortData(
    data: TInpatient["Patient"][],
    sort: "name" | "admissionDate" | undefined,
  ): TInpatient["Patient"][] {
    if (!sort) {
      return data;
    }

    const sorted = [...data];

    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "admissionDate") {
      sorted.sort(
        (a, b) =>
          dayjs(a.admissionDate).valueOf() - dayjs(b.admissionDate).valueOf(),
      );
    }

    return sorted;
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  return {
    generateMockInpatient,
    generateAllMockData,
    sortData,
    formatCurrency,
  };
}
