import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/formatters";
import { IPatient } from "@/types/patient.interface";
import { format, isValid } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import DoctorPatientAppointmentHistory from "./DoctorPatientAppointmentHistory";

const display = (value?: string | null) => value || "Not provided";
const yesNo = (value?: boolean | null) =>
  value == null ? "Not provided" : value ? "Yes" : "No";
const humanize = (value?: string | null) =>
  value
    ? value
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Not provided";

function formatDate(value?: string | null) {
  if (!value) return "Not provided";
  const date = new Date(value);
  return isValid(date) ? format(date, "MMM d, yyyy") : "Not provided";
}

export default function DoctorPatientDetails({
  patient,
}: {
  patient: IPatient;
}) {
  const health = patient.patientHealthData;
  const appointments = patient.appointments || [];
  const reports = patient.medicalReport || [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <header className="space-y-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 gap-2 text-slate-500 hover:text-teal-700"
        >
          <Link href="/doctor/dashboard/patients">
            <ArrowLeft className="h-4 w-4" />
            Back to patients
          </Link>
        </Button>

        <section className="relative overflow-hidden rounded-3xl border border-teal-100 bg-linear-to-br from-white via-teal-50/70 to-cyan-50/70 p-5 shadow-sm sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border-[24px] border-white/50" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <Avatar className="h-16 w-16 shrink-0 border-4 border-white shadow-sm sm:h-20 sm:w-20">
                <AvatarImage
                  src={patient.profilePhoto || ""}
                  alt={patient.name}
                />
                <AvatarFallback className="bg-teal-100 text-lg font-semibold text-teal-800 sm:text-xl">
                  {getInitials(patient.name || "Patient")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                  Patient record
                </p>
                <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl [overflow-wrap:anywhere]">
                  {patient.name}
                </h1>
                <p className="mt-1 flex min-w-0 items-center gap-1.5 break-all text-sm leading-5 text-slate-600">
                  <Mail className="h-4 w-4 shrink-0 text-teal-700" />
                  {patient.email}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
              <Badge
                variant="outline"
                className="gap-1.5 border-teal-200 bg-white/80 px-3 py-1.5 text-teal-800"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Assigned patient
              </Badge>
              <Badge
                variant="outline"
                className={
                  health
                    ? "gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "gap-1.5 border-amber-200 bg-amber-50 text-amber-800"
                }
              >
                {health ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <ClipboardList className="h-3.5 w-3.5" />
                )}
                {health ? "Health record available" : "No health record"}
              </Badge>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 border-t border-teal-100/80 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <ContactItem
              icon={<Phone />}
              label="Phone"
              value={display(patient.contactNumber)}
            />
            <ContactItem
              icon={<MapPin />}
              label="Address"
              value={display(patient.address)}
            />
            <ContactItem
              icon={<CalendarDays />}
              label="Patient since"
              value={formatDate(patient.createdAt)}
            />
          </div>
        </section>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={<CalendarDays />}
          label="Appointments with you"
          value={appointments.length}
          accent="teal"
        />
        <SummaryCard
          icon={<FileText />}
          label="Medical reports"
          value={reports.length}
          accent="blue"
        />
        <SummaryCard
          icon={<HeartPulse />}
          label="Health record"
          value={health ? "Available" : "Not available"}
          accent={health ? "emerald" : "amber"}
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle
          icon={<HeartPulse />}
          title="Health information"
          description="Patient-provided health details"
        />
        {health ? (
          <div className="grid gap-3 border-t border-slate-100 bg-slate-50/40 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
            <Info label="Gender" value={humanize(health.gender)} />
            <Info label="Date of birth" value={formatDate(health.dateOfBirth)} />
            <Info
              label="Blood group"
              value={health.bloodGroup.replace(/_/g, " ")}
            />
            <Info label="Height" value={health.height} />
            <Info label="Weight" value={health.weight} />
            <Info
              label="Marital status"
              value={humanize(health.maritalStatus)}
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
          <EmptyState
            icon={<HeartPulse />}
            title="No health information yet"
            description="Health details will appear here once the patient adds them to their record."
          />
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle
          icon={<FileText />}
          title="Medical reports"
          description="Reports shared by this patient"
          count={reports.length}
        />
        {reports.length > 0 ? (
          <div className="grid gap-3 border-t border-slate-100 p-4 sm:p-5 xl:grid-cols-2">
            {reports.map((report) => (
              <article
                key={report.id}
                className="flex min-w-0 flex-col items-start justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-4 transition-colors hover:border-teal-200 hover:bg-teal-50/30 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {report.reportName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Added {formatDate(report.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={report.reportLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="icon"
                    variant="outline"
                    title="Download report"
                  >
                    <a
                      href={report.reportLink}
                      download={report.reportName}
                      aria-label={`Download ${report.reportName}`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText />}
            title="No medical reports available"
            description="Reports shared by the patient will be listed here."
          />
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionTitle
          icon={<CalendarDays />}
          title="Appointment history"
          description="Appointments associated with this patient"
          count={appointments.length}
        />
        <DoctorPatientAppointmentHistory appointments={appointments} />
      </section>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  description,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 [&_svg]:h-4 [&_svg]:w-4">
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>
      {count !== undefined && (
        <Badge variant="outline" className="shrink-0 bg-slate-50">
          {count}
        </Badge>
      )}
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-teal-700 [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: "teal" | "blue" | "emerald" | "amber";
}) {
  const accentClasses = {
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${accentClasses[accent]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight text-slate-900">
          {value}
        </p>
        <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center border-t border-slate-100 px-5 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
