import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IPatient } from "@/types/patient.interface";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";

const display = (value?: string | null) => value || "Not provided";
const yesNo = (value?: boolean | null) => (value ? "Yes" : "No");

export default function DoctorPatientDetails({
  patient,
}: {
  patient: IPatient;
}) {
  const health = patient.patientHealthData;
  const appointments = patient.appointments || [];

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button
            asChild
            variant="ghost"
            className="mb-2 -ml-3 gap-2 text-slate-500"
          >
            <Link href="/doctor/dashboard/patients">
              <ArrowLeft className="h-4 w-4" /> Back to patients
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {patient.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Patient record and appointment history
              </p>
            </div>
          </div>
        </div>
        <Badge
          variant="outline"
          className="gap-1.5 border-teal-200 bg-teal-50 text-teal-700"
        >
          <ShieldCheck className="h-3.5 w-3.5" /> Assigned patient
        </Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5 md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Contact information
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Info icon={<Mail />} label="Email" value={patient.email} />
            <Info
              icon={<Phone />}
              label="Phone"
              value={display(patient.contactNumber)}
            />
            <Info
              icon={<MapPin />}
              label="Address"
              value={display(patient.address)}
            />
            <Info
              icon={<CalendarDays />}
              label="Patient since"
              value={format(new Date(patient.createdAt), "MMM d, yyyy")}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Record overview
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {appointments.length}
          </p>
          <p className="text-sm text-slate-500">Appointments with you</p>
          <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
            <FileText className="h-4 w-4 text-teal-600" />{" "}
            {patient.medicalReport?.length || 0} medical reports
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle icon={<HeartPulse />} title="Health information" />
        {health ? (
          <div className="grid gap-x-8 gap-y-5 border-t border-slate-100 p-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Gender" value={health.gender} />
            <Info label="Date of birth" value={health.dateOfBirth} />
            <Info
              label="Blood group"
              value={health.bloodGroup.replace("_", " ")}
            />
            <Info label="Height" value={health.height} />
            <Info label="Weight" value={health.weight} />
            <Info
              label="Marital status"
              value={display(health.maritalStatus)}
            />
            <Info label="Allergies" value={yesNo(health.hasAllergies)} />
            <Info label="Diabetes" value={yesNo(health.hasDiabetes)} />
            <Info
              label="Past surgeries"
              value={yesNo(health.hasPastSurgeries)}
            />
            <Info label="Smoking" value={yesNo(health.smokingStatus)} />
            <Info
              label="Immunization"
              value={display(health.immunizationStatus)}
            />
            <Info
              label="Dietary preferences"
              value={display(health.dietaryPreferences)}
            />
            <Info
              label="Mental health history"
              value={display(health.mentalHealthHistory)}
            />
            <Info label="Recent anxiety" value={yesNo(health.recentAnxiety)} />
            <Info
              label="Recent depression"
              value={yesNo(health.recentDepression)}
            />
          </div>
        ) : (
          <p className="border-t border-slate-100 p-5 text-sm text-slate-500">
            This patient has not added health information yet.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle icon={<FileText />} title="Medical reports" />
        <div className="grid gap-3 border-t border-slate-100 p-5 sm:grid-cols-2">
          {patient.medicalReport?.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {report.reportName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Uploaded {format(new Date(report.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={report.reportLink} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </Button>
                <Button
                  asChild
                  size="icon"
                  variant="outline"
                  title="Download report"
                >
                  <a href={report.reportLink} download={report.reportName}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">
                      Download {report.reportName}
                    </span>
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
        {!patient.medicalReport?.length && (
          <p className="border-t border-slate-100 p-5 text-sm text-slate-500">
            No medical reports available.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle icon={<CalendarDays />} title="Appointment history" />
        <div className="overflow-x-auto border-t border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Prescription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-5 py-4 text-slate-700">
                    {appointment.schedule?.startDateTime
                      ? format(
                          new Date(appointment.schedule.startDateTime),
                          "MMM d, yyyy · h:mm a",
                        )
                      : "Date unavailable"}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="outline">{appointment.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {appointment.prescription ? "Provided" : "Not provided"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <p className="p-5 text-sm text-slate-500">
              No appointment history available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 px-5 py-4">
      <span className="text-teal-600">{icon}</span>
      <h2 className="font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon && <span className="text-teal-600">{icon}</span>}
        {label}
      </p>
      <p className="mt-1 wrap-break-word font-medium text-slate-800">{value}</p>
    </div>
  );
}
