import DoctorPatientDetails from "@/components/modules/Doctor/DoctorPatients/DoctorPatientDetails";
import { getDoctorPatientById } from "@/services/patient/health-records.service";
import { notFound } from "next/navigation";

export default async function DoctorPatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getDoctorPatientById(id);

  if (!response?.success || !response.data) {
    notFound();
  }

  return <DoctorPatientDetails patient={response.data} />;
}
