"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { IPatient } from "@/types/patient.interface";
import { useRouter } from "next/navigation";
import { doctorPatientColumns } from "./doctorPatientColumns";

interface DoctorPatientsTableProps {
  patients: IPatient[];
}

export default function DoctorPatientsTable({ patients }: DoctorPatientsTableProps) {
  const router = useRouter();

  return (
    <ManagementTable
      data={patients}
      columns={doctorPatientColumns}
      onView={(patient) => router.push(`/doctor/dashboard/patients/${patient.id}`)}
      getRowKey={(patient) => patient.id || patient.email}
      emptyMessage="No appointed patients found"
    />
  );
}
