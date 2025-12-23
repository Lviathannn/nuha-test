"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputCurrency } from "@/components/ui/input-currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseRupiah } from "@/lib/format";
import { InpatientConstant } from "../inpatient-constant";
import { useInpatientStore } from "../inpatient-store";
import type { TInpatient } from "../inpatient-types";

export function InpatientForm() {
  return <InpatientFormDialog />;
}

export function InpatientFormDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full flex justify-end">
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Tambah Pasien
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-full">
        <DialogHeader>
          <DialogTitle>Tambah Pasien</DialogTitle>

          <DialogDescription>
            Silakan isi form di bawah ini untuk menambahkan pasien baru.
          </DialogDescription>
        </DialogHeader>

        <InpatientFormField onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

type InpatientFormFieldProps = {
  onSuccess: () => void;
};

function InpatientFormField({ onSuccess }: InpatientFormFieldProps) {
  const defaultValues: TInpatient["FormFields"] = {
    name: "",
    nik: "",
    room: "",
    diagnosis: "",
    status: "normal",
    admissionDate: dayjs().toDate(),
    costEstimate: "0",
  };

  const form = useForm<z.infer<typeof InpatientConstant.formSchema>>({
    resolver: zodResolver(InpatientConstant.formSchema),
    defaultValues: defaultValues,
  });

  const queryClient = useQueryClient();
  const { states } = useInpatientStore();

  function onSubmit(data: z.infer<typeof InpatientConstant.formSchema>) {
    const newPatient: TInpatient["Patient"] = {
      id: crypto.randomUUID(),
      name: data.name,
      nik: data.nik,
      room: data.room,
      diagnosis: data.diagnosis,
      status: data.status,
      admissionDate: dayjs(data.admissionDate).format("YYYY-MM-DD"),
      costEstimate: parseRupiah(data.costEstimate),
    };

    const search = states.filter.search || "";
    const sort = states.filter.sort || "name";
    const queryKey = ["inpatient", "table", 1, 10, search, sort];

    const matchesSearch =
      !search ||
      newPatient.name.toLowerCase().includes(search.toLowerCase()) ||
      newPatient.nik.includes(search);

    type InfiniteQueryData = InfiniteData<{
      data: TInpatient["Patient"][];
      nextCursor: number | null;
    }>;

    if (matchesSearch) {
      queryClient.setQueryData<InfiniteQueryData>(queryKey, (oldData) => {
        if (!oldData) {
          return {
            pages: [
              {
                data: [newPatient],
                nextCursor: null,
              },
            ],
            pageParams: [1],
          };
        }

        const updatedPages = oldData.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              data: [newPatient, ...page.data],
            };
          }
          return page;
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["inpatient", "table"] });
    }

    form.reset(defaultValues);
    onSuccess();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>

              <FormControl>
                <Input placeholder="Masukan Nama pasien" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK</FormLabel>

              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="Masukan NIK pasien"
                  onKeyDown={(e) => {
                    console.log(e.key);
                    if (
                      e.key === "Backspace" ||
                      e.key === "Copy" ||
                      e.key === "Paste" ||
                      e.key === "Cut" ||
                      e.metaKey ||
                      e.key === "ArrowLeft" ||
                      e.key === "ArrowRight" ||
                      e.key === "Tab"
                    ) {
                      return;
                    }

                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ruangan</FormLabel>

              <FormControl>
                <Input placeholder="Masukan Ruangan pasien" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis</FormLabel>
              <FormControl>
                <Input placeholder="Masukan Diagnosis pasien" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="costEstimate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biaya Estimasi</FormLabel>

              <FormControl>
                <InputCurrency
                  placeholder="Masukan Biaya Estimasi pasien"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Status pasien" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>

                    <SelectItem value="warning">Waspada</SelectItem>

                    <SelectItem value="critical">Kritis</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            className="cursor-pointer"
            onClick={() => {
              form.reset(defaultValues);
              onSuccess?.();
            }}
          >
            Batal
          </Button>

          <Button
            type="submit"
            size="default"
            className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
