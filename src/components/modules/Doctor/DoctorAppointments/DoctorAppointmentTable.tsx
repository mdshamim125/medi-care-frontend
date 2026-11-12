"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AppointmentStatus,
  IAppointment,
} from "@/types/appointments.interface";
import ChangeAppointmentStatusDialog from "./ChangeAppointmentStatusDialog";
import DoctorAppointmentDetailDialog from "./DoctorAppointmentDetailDialog";
import { doctorAppointmentColumns } from "./doctorAppointmentColumns";

interface DoctorAppointmentsTableProps {
  appointments: IAppointment[];
}

export default function DoctorAppointmentsTable({
  appointments = [],
}: DoctorAppointmentsTableProps) {
  const router = useRouter();
  const [viewingAppointment, setViewingAppointment] =
    useState<IAppointment | null>(null);
  const [changingStatusAppointment, setChangingStatusAppointment] =
    useState<IAppointment | null>(null);

  const handleView = (appointment: IAppointment) => {
    setViewingAppointment(appointment);
  };

  const handleStatusChange = (appointment: IAppointment) => {
    setChangingStatusAppointment(appointment);
  };

  // Custom wrapper to conditionally show edit action
  const handleEditClick = (appointment: IAppointment) => {
    if (
      appointment.status === AppointmentStatus.CANCELED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      toast.error("This appointment status is locked", {
        description:
          "Completed and canceled appointments cannot be modified.",
      });
      return;
    }

    handleStatusChange(appointment);
  };

  return (
    <>
      <ManagementTable
        data={appointments}
        columns={doctorAppointmentColumns}
        onView={handleView}
        onEdit={handleEditClick}
        getRowKey={(appointment) => appointment.id}
        emptyMessage="No appointments found"
      />

      {/* View Detail Dialog */}
      {viewingAppointment && (
        <DoctorAppointmentDetailDialog
          appointment={viewingAppointment}
          open={!!viewingAppointment}
          onClose={() => {
            setViewingAppointment(null);
            router.refresh();
          }}
        />
      )}

      {/* Change Status Dialog */}
      {changingStatusAppointment && (
        <ChangeAppointmentStatusDialog
          appointment={changingStatusAppointment}
          isOpen={!!changingStatusAppointment}
          onClose={() => {
            setChangingStatusAppointment(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
