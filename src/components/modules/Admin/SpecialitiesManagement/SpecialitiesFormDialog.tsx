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
import { createSpeciality } from "@/services/admin/specialitiesManagement";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, Stethoscope } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ISpecialitiesFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SpecialitiesFormDialog = ({
  open,
  onClose,
  onSuccess,
}: ISpecialitiesFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(createSpeciality, null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handledStateRef = useRef<typeof state>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      formRef.current?.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  // Handle server action result
  useEffect(() => {
    if (!state || handledStateRef.current === state) return;
    handledStateRef.current = state;

    if (state?.success) {
      toast.success(state.message || "Specialty created successfully");
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message || "Something went wrong");

      // Restore file after validation error
      if (selectedFile && fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(selectedFile);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  }, [state, onSuccess, onClose, selectedFile]);

  const handleClose = () => {
    if (pending) return;
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 gap-0 sm:max-w-[440px]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Add New Specialty
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new medical specialty with a title and icon.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Title */}
            <Field>
              <FieldLabel htmlFor="title" className="flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                Title
              </FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="Cardiology"
                defaultValue={state?.formData?.title || ""}
                className="h-10"
                disabled={pending}
              />
              <InputFieldError field="title" state={state} />
            </Field>

            {/* Icon Upload */}
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Specialty Icon
              </FieldLabel>

              <div
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
                  "bg-muted/40 hover:bg-muted/60",
                  selectedFile
                    ? "border-primary/40 bg-primary/5"
                    : "border-muted-foreground/25",
                  pending && "opacity-60 pointer-events-none",
                )}
              >
                <input
                  ref={fileInputRef}
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  disabled={pending}
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-3 py-6 px-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border-2 border-background shadow-sm">
                      <Image
                        src={URL.createObjectURL(selectedFile)}
                        alt="Icon preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium truncate max-w-[220px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Click to change image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Click to upload icon</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        PNG, JPG or SVG recommended
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <InputFieldError field="icon" state={state} />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={pending}
              className="min-w-[90px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="min-w-[140px]"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Specialty"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialitiesFormDialog;