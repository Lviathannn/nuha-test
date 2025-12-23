import { PageHeader } from "@/components/ui/page-header";
import {
  InpatientFilter,
  InpatientHeader,
  InpatientTable,
} from "@/features/inpatient";
import { InpatientForm } from "@/features/inpatient/components/inpatient-form";

export default function Home() {
  return (
    <main className="flex flex-col gap-10 w-full">
      <div className="flex justify-between items-center bgb">
        <PageHeader
          title="Rawat Inap - Passien Masuk"
          description="List Data Pasien Masuk"
        />

        <InpatientForm />
      </div>

      <InpatientHeader />

      <InpatientFilter />

      <InpatientTable />
    </main>
  );
}
