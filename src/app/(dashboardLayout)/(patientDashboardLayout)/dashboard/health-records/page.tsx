import HealthRecordsClient from "@/components/modules/Patient/HealthRecords/HealthRecordsClient";
import {
  getMyHealthData,
  getMyMedicalReports,
} from "@/services/patient/health-records.service";
import { IPatientHealthData, IMedicalReport } from "@/types/patient.interface";

export default async function HealthRecordsPage() {
  const [healthDataResponse, reportsResponse] = await Promise.all([
    getMyHealthData(),
    getMyMedicalReports(),
  ]);

  const healthData: IPatientHealthData | null = healthDataResponse.success
    ? healthDataResponse.data
    : null;
  const medicalReports: IMedicalReport[] = reportsResponse.success
    ? reportsResponse.data || []
    : [];

  return (
    <HealthRecordsClient
      initialHealthData={healthData}
      initialMedicalReports={medicalReports}
    />
  );
}
