import { Column } from "@/components/shared/ManagementTable";
import { Badge } from "@/components/ui/badge";
import { IPatient } from "@/types/patient.interface";
import { format } from "date-fns";
import { FileText, HeartPulse, Mail, Phone, UserRound } from "lucide-react";

const formatValue = (value?: string | null) => value || "Not provided";

export const doctorPatientColumns: Column<IPatient>[] = [
  {
    header: "Patient",
    accessor: (patient) => (
      <div className="flex min-w-[210px] items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
          <UserRound className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{patient.name}</p>
          <p className="flex items-center gap-1 truncate text-xs text-slate-500">
            <Mail className="h-3 w-3" /> {patient.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Contact",
    accessor: (patient) => (
      <span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-600">
        <Phone className="h-3.5 w-3.5 text-slate-400" />
        {formatValue(patient.contactNumber)}
      </span>
    ),
  },
  {
    header: "Health snapshot",
    accessor: (patient) => {
      const health = patient.patientHealthData;
      return health ? (
        <div className="flex min-w-[175px] items-center gap-2">
          <HeartPulse className="h-4 w-4 text-rose-500" />
          <div className="text-sm">
            <p className="font-medium text-slate-700">
              {health.bloodGroup.replace("_", " ")} · {health.gender.toLowerCase()}
            </p>
            <p className="text-xs text-slate-500">
              {health.height} / {health.weight}
            </p>
          </div>
        </div>
      ) : (
        <span className="text-sm text-slate-400">No health data</span>
      );
    },
  },
  {
    header: "Reports",
    accessor: (patient) => (
      <Badge variant="outline" className="gap-1 font-medium">
        <FileText className="h-3.5 w-3.5" />
        {patient.medicalReport?.length || 0}
      </Badge>
    ),
  },
  {
    header: "Patient since",
    accessor: (patient) => (
      <span className="whitespace-nowrap text-sm text-slate-600">
        {patient.createdAt ? format(new Date(patient.createdAt), "MMM d, yyyy") : "N/A"}
      </span>
    ),
    sortKey: "createdAt",
  },
];
