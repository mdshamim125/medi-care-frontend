"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createSchedule } from "@/services/admin/schedulesManagement";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface IScheduleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ScheduleFormDialog = ({
  open,
  onClose,
  onSuccess,
}: IScheduleFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createSchedule, null);
  const handledStateRef = useRef<typeof state>(null);

  // Handle success / error from server action
  useEffect(() => {
    if (!state || handledStateRef.current === state) return;
    handledStateRef.current = state;

    if (state?.success) {
      toast.success(state.message || "Schedule created successfully");
      formRef.current?.reset();
      onSuccess();
      onClose();
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      formRef.current?.reset();
    }
  }, [open]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 gap-0 sm:max-w-[440px]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Create Schedule
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Define a date range and working hours. Slots will be generated in
            30-minute intervals.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="startDate"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Start Date
                </FieldLabel>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={state?.formData?.startDate || ""}
                  className="h-10"
                  disabled={isPending}
                />
                <InputFieldError field="startDate" state={state} />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="endDate"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  End Date
                </FieldLabel>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  defaultValue={state?.formData?.endDate || ""}
                  className="h-10"
                  disabled={isPending}
                />
                <InputFieldError field="endDate" state={state} />
              </Field>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="startTime"
                  className="flex items-center gap-2"
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Start Time
                </FieldLabel>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  defaultValue={state?.formData?.startTime || ""}
                  className="h-10"
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  24-hour format (e.g. 09:00)
                </p>
                <InputFieldError field="startTime" state={state} />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="endTime"
                  className="flex items-center gap-2"
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  End Time
                </FieldLabel>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  defaultValue={state?.formData?.endTime || ""}
                  className="h-10"
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  24-hour format (e.g. 17:00)
                </p>
                <InputFieldError field="endTime" state={state} />
              </Field>
            </div>

            {/* Helper note */}
            <div className="rounded-lg border bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Schedules will be automatically created in{" "}
                <span className="font-medium text-foreground">
                  30-minute intervals
                </span>{" "}
                between the selected start and end times for every day in the
                date range.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="min-w-[90px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Schedule"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleFormDialog;