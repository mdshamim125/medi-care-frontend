"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeAppointmentStatus } from "@/services/patient/appointment.service";
import {
  AppointmentStatus,
  IAppointment,
} from "@/types/appointments.interface";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ChangeStatusDialogProps {
  appointment: IAppointment;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions = [
  {
    value: AppointmentStatus.SCHEDULED,
    label: "Scheduled",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    value: AppointmentStatus.INPROGRESS,
    label: "In Progress",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    value: AppointmentStatus.COMPLETED,
    label: "Completed",
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: AppointmentStatus.CANCELED,
    label: "Canceled",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  },
];

export default function ChangeAppointmentStatusDialog({
  appointment,
  isOpen,
  onClose,
}: ChangeStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<AppointmentStatus>(
    appointment.status
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStatus = statusOptions.find(
    (opt) => opt.value === appointment.status
  );

  const handleSubmit = async () => {
    if (newStatus === appointment.status) {
      toast.info("No changes made");
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await changeAppointmentStatus(appointment.id, newStatus);

      if (result.success) {
        toast.success("Appointment status updated successfully");

        if (
          newStatus === AppointmentStatus.COMPLETED &&
          !appointment.prescription
        ) {
          setTimeout(() => {
            toast.info(
              "Don't forget to provide a prescription for this patient",
              { duration: 5000 }
            );
          }, 1000);
        }

        onClose();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Appointment Status</DialogTitle>
          <DialogDescription>
            Update the status for{" "}
            <span className="font-medium text-foreground">
              {appointment.patient?.name || "this patient"}
            </span>
            &apos;s appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Current Status */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Current Status</Label>
            <div>
              {currentStatus && (
                <Badge variant="outline" className={currentStatus.className}>
                  {currentStatus.label}
                </Badge>
              )}
            </div>
          </div>

          {/* New Status */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select
              value={newStatus}
              onValueChange={(value) =>
                setNewStatus(value as AppointmentStatus)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warning for Completion */}
          {newStatus === AppointmentStatus.COMPLETED &&
            !appointment.prescription && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-800 dark:bg-amber-950/40">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                  <span className="font-medium">Reminder:</span> After marking
                  as completed, please provide a prescription for this patient.
                </p>
              </div>
            )}
        </div>

                <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm Change"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}