type TPatientStatus = "warning" | "normal" | "critical";

export type TInpatient = {
  Patient: {
    id: string;
    name: string;
    nik: string;
    room: string;
    diagnosis: string;
    status: TPatientStatus;
    admissionDate: string;
    costEstimate: number;
  };
  FormFields: {
    name: string;
    nik: string;
    room: string;
    diagnosis: string;
    status: TPatientStatus;
    admissionDate: Date;
    costEstimate: string;
  };
};
