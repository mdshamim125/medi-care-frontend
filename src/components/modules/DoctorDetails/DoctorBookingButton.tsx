"use client";

import { Button } from "@/components/ui/button";
import BookAppointmentDialog from "@/components/modules/Consultation/BookAppointmentDialog";
import { IDoctor } from "@/types/doctor.interface";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";

interface DoctorBookingButtonProps {
  doctor: IDoctor;
}

export default function DoctorBookingButton({
  doctor,
}: DoctorBookingButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="lg"
        onClick={() => setIsDialogOpen(true)}
        className="h-11 w-full gap-2 rounded-xl px-5 shadow-sm md:w-auto"
      >
        <CalendarPlus className="h-4 w-4" />
        Book Appointment
      </Button>
      <BookAppointmentDialog
        doctor={doctor}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
