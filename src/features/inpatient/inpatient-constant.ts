import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama pasien harus diisi" }),
  nik: z.string().min(1, { message: "NIK harus diisi" }),
  room: z.string().min(1, { message: "Ruangan harus diisi" }),
  diagnosis: z.string().min(1, { message: "Diagnosa harus diisi" }),
  status: z.enum(["normal", "warning", "critical"], {
    message: "Status harus diisi",
  }),
  admissionDate: z.date(),
  costEstimate: z.string().min(1, { message: "Biaya estimasi harus diisi" }),
});

export const InpatientConstant = {
  formSchema,
};
