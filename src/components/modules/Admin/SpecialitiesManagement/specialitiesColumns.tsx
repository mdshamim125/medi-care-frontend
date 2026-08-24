import { Column } from "@/components/shared/ManagementTable";
import { ISpecialty } from "@/types/specialities.interface";
import Image from "next/image";

export const specialitiesColumns: Column<ISpecialty>[] = [
  {
    header: "Icon",
    accessor: (speciality) => (
      <Image
        src={speciality.icon}
        alt={speciality.title}
        width={40}
        height={40}
        className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
      />
    ),
    className: "w-[84px]",
  },
  {
    header: "Title",
    accessor: (speciality) => (
      <div className="py-1">
        <p className="font-semibold text-slate-900">{speciality.title}</p>
        <p className="mt-0.5 text-xs text-slate-500">Medical specialty</p>
      </div>
    ),
  },
];
