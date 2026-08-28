import PatientPrescriptionsList from "@/components/modules/Patient/PatientPrescription/PatientPrescriptionList";
import { getMyPrescriptions } from "@/services/patient/prescription.service";
import { IPrescription } from "@/types/prescription.interface";

export default async function MyPrescriptionsPage() {
  const response = await getMyPrescriptions();
  const prescriptions: IPrescription[] = response?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Prescriptions</h1>
          <p className="mt-1.5 text-muted-foreground">
            View and download prescriptions from your completed appointments
          </p>
        </div>
        {prescriptions.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {prescriptions.length} prescription
            {prescriptions.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <PatientPrescriptionsList prescriptions={prescriptions} />
    </div>
  );
}