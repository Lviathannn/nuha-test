"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import dayjs from "dayjs";
import { ChevronDownIcon, Search } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInpatientStore } from "../inpatient-store";

/**
 * ================================================================================
 * Main Component
 * ================================================================================
 */

export function InpatientFilter() {
  return (
    <div className="flex gap-4 w-full justify-between">
      <SearchInput />

      <div className="flex gap-4">
        <SortButton />

        <DateFilter />
      </div>
    </div>
  );
}

/**
 * ================================================================================
 * Sub Component
 * ================================================================================
 */

function SearchInput() {
  const { states, actions } = useInpatientStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    actions.setSearch(event.target.value);
  };

  return (
    <InputGroup className="w-[250px]">
      <InputGroupInput
        placeholder="Cari Pasien"
        value={states.filter.search}
        onChange={handleSearchChange}
      />

      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}

const options = [
  { label: "Nama", value: "name" },
  { label: "Tanggal Masuk", value: "admissionDate" },
];

function SortButton() {
  const { states, actions } = useInpatientStore();

  const handleSortChange = (value: string) => {
    actions.setSort(value as "name" | "admissionDate");
  };

  return (
    <Select value={states.filter.sort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DateFilter() {
  const [open, setOpen] = useState(false);
  const { states, actions } = useInpatientStore();

  const handleDateChange = (dateRange: DateRange | undefined) => {
    if (dateRange) {
      actions.setStartDate(dayjs(dateRange.from).format("YYYY-MM-DD"));
      actions.setEndDate(dayjs(dateRange.to).format("YYYY-MM-DD"));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="justify-between font-normal w-[320px]"
        >
          {dayjs(states.filter.startDate).format("DD MMMM YYYY")} -{" "}
          {dayjs(states.filter.endDate).format("DD MMMM YYYY")}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0 z-50" align="start">
        <Calendar
          mode="range"
          defaultMonth={dayjs(states.filter.startDate).toDate()}
          selected={{
            from: dayjs(states.filter.startDate).toDate(),
            to: dayjs(states.filter.endDate).toDate(),
          }}
          onSelect={handleDateChange}
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  );
}
