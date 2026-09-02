import DoctorPatientsTable from "@/components/modules/Doctor/DoctorPatients/DoctorPatientsTable";
import { getDoctorPatients } from "@/services/patient/health-records.service";
import { IPatient } from "@/types/patient.interface";
import { Activity, FileText, Users } from "lucide-react";

export default async function DoctorPatientsPage() {
  const response = await getDoctorPatients();
  const patients: IPatient[] = response?.data || [];
  const withHealthData = patients.filter((patient) => patient.patientHealthData).length;
  const reportCount = patients.reduce((count, patient) => count + (patient.medicalReport?.length || 0), 0);

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Patient management</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My patients</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">Review patients from your paid appointments and open their complete health records.</p>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 px-5 py-5 sm:px-7">
        <div className="relative z-10 flex flex-wrap items-center gap-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><Users className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold text-slate-900">{patients.length}</p><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total patients</p></div>
          <div className="h-10 w-px bg-teal-200" />
          <div><p className="text-2xl font-bold text-slate-900">{withHealthData}</p><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Records completed</p></div>
          <div className="h-10 w-px bg-teal-200" />
          <div><p className="text-2xl font-bold text-slate-900">{reportCount}</p><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Reports available</p></div>
          <Activity className="ml-auto hidden h-12 w-12 text-teal-200 sm:block" />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:px-6"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-teal-500" /><h2 className="font-bold text-slate-900">Appointed patients</h2></div><p className="text-sm text-slate-500">Select a patient to review demographics, health information, reports, and appointment history.</p></div>
        <div className="overflow-x-auto"><DoctorPatientsTable patients={patients} /></div>
      </section>
    </div>
  );
}
