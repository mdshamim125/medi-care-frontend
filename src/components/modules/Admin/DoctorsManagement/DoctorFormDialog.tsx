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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDoctor, updateDoctor } from "@/services/admin/doctorManagement";
import { IDoctor } from "@/types/doctor.interface";
import { ISpecialty } from "@/types/specialities.interface";
import { useSpecialtySelection } from "@/hooks/useSpecialtySelection";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Camera,
  GraduationCap,
  Hash,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import SpecialtyMultiSelect from "./SpecialtyMultiSelect";

interface IDoctorFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctor?: IDoctor;
  specialities?: ISpecialty[];
}

const DoctorFormDialog = ({
  open,
  onClose,
  onSuccess,
  doctor,
  specialities = [],
}: IDoctorFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!doctor;

  const [gender, setGender] = useState<"MALE" | "FEMALE">(
    doctor?.gender || "MALE",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handledStateRef = useRef<typeof state>(null);

  const [state, formAction, pending] = useActionState(
    isEdit ? updateDoctor.bind(null, doctor.id!) : createDoctor,
    null,
  );

  const specialtySelection = useSpecialtySelection({
    doctor,
    isEdit,
    open,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  // Reset local state when dialog closes
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null);
      setGender(doctor?.gender || "MALE");
      formRef.current?.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, doctor?.gender]);

  // Handle server action result
  useEffect(() => {
    if (!state || handledStateRef.current === state) return;
    handledStateRef.current = state;

    if (state?.success) {
      toast.success(state.message || "Operation successful");
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message || "Something went wrong");

      // Restore selected file after validation error
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

  const getSpecialtyTitle = (id: string): string => {
    return specialities.find((s) => s.id === id)?.title || "Unknown";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 gap-0 sm:max-w-[560px]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEdit ? "Edit Doctor" : "Add New Doctor"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Update the doctor’s profile and professional details."
              : "Fill in the details to create a new doctor account."}
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* ── Basic Info ── */}
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name" className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Full Name
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Dr. John Doe"
                  defaultValue={
                    state?.formData?.name || (isEdit ? doctor?.name : "")
                  }
                  className="h-10"
                  disabled={pending}
                />
                <InputFieldError state={state} field="name" />
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@example.com"
                  defaultValue={
                    state?.formData?.email || (isEdit ? doctor?.email : "")
                  }
                  disabled={isEdit || pending}
                  className="h-10"
                />
                <InputFieldError state={state} field="email" />
              </Field>

              {!isEdit && (
                <>
                  <Field>
                    <FieldLabel
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      Password
                    </FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      defaultValue={state?.formData?.password || ""}
                      className="h-10"
                      disabled={pending}
                    />
                    <InputFieldError state={state} field="password" />
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="confirmPassword"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      defaultValue={state?.formData?.confirmPassword || ""}
                      className="h-10"
                      disabled={pending}
                    />
                    <InputFieldError state={state} field="confirmPassword" />
                  </Field>
                </>
              )}
            </div>

            {/* ── Specialties ── */}
            <div className="space-y-2">
              <SpecialtyMultiSelect
                selectedSpecialtyIds={specialtySelection.selectedSpecialtyIds}
                removedSpecialtyIds={specialtySelection.removedSpecialtyIds}
                currentSpecialtyId={specialtySelection.currentSpecialtyId}
                availableSpecialties={specialtySelection.getAvailableSpecialties(
                  specialities,
                )}
                isEdit={isEdit}
                onCurrentSpecialtyChange={
                  specialtySelection.setCurrentSpecialtyId
                }
                onAddSpecialty={specialtySelection.handleAddSpecialty}
                onRemoveSpecialty={specialtySelection.handleRemoveSpecialty}
                getSpecialtyTitle={getSpecialtyTitle}
                getNewSpecialties={specialtySelection.getNewSpecialties}
              />
              <InputFieldError field="specialties" state={state} />
            </div>

            {/* ── Contact & Location ── */}
            <div className="space-y-4">
              <Field>
                <FieldLabel
                  htmlFor="contactNumber"
                  className="flex items-center gap-2"
                >
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Contact Number
                </FieldLabel>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="+1 234 567 890"
                  defaultValue={
                    state?.formData?.contactNumber ||
                    (isEdit ? doctor?.contactNumber : "")
                  }
                  className="h-10"
                  disabled={pending}
                />
                <InputFieldError state={state} field="contactNumber" />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="address"
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  Address
                </FieldLabel>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, Country"
                  defaultValue={
                    state?.formData?.address || (isEdit ? doctor?.address : "")
                  }
                  className="h-10"
                  disabled={pending}
                />
                <InputFieldError state={state} field="address" />
              </Field>
            </div>

            {/* ── Professional Details ── */}
            <div className="space-y-4">
              <Field>
                <FieldLabel
                  htmlFor="registrationNumber"
                  className="flex items-center gap-2"
                >
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  Registration Number
                </FieldLabel>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  placeholder="REG123456"
                  defaultValue={
                    state?.formData?.registrationNumber ||
                    (isEdit ? doctor?.registrationNumber : "")
                  }
                  className="h-10"
                  disabled={pending}
                />
                <InputFieldError state={state} field="registrationNumber" />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="experience"
                    className="flex items-center gap-2"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    Experience (years)
                  </FieldLabel>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    placeholder="5"
                    min="0"
                    defaultValue={
                      state?.formData?.experience ||
                      (isEdit ? doctor?.experience : "")
                    }
                    className="h-10"
                    disabled={pending}
                  />
                  <InputFieldError state={state} field="experience" />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="gender"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    Gender
                  </FieldLabel>
                  <input type="hidden" name="gender" value={gender} />
                  <Select
                    value={gender}
                    onValueChange={(value) =>
                      setGender(value as "MALE" | "FEMALE")
                    }
                    disabled={pending}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputFieldError state={state} field="gender" />
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="appointmentFee"
                  className="flex items-center gap-2"
                >
                  <span className="text-muted-foreground text-sm font-medium">
                    $
                  </span>
                  Appointment Fee
                </FieldLabel>
                <Input
                  id="appointmentFee"
                  name="appointmentFee"
                  type="number"
                  placeholder="100"
                  min="0"
                  defaultValue={
                    state?.formData?.appointmentFee ??
                    (isEdit ? doctor?.appointmentFee : "")
                  }
                  className="h-10"
                  disabled={pending}
                />
                <InputFieldError state={state} field="appointmentFee" />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="qualification"
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                  Qualification
                </FieldLabel>
                <Input
                  id="qualification"
                  name="qualification"
                  placeholder="MBBS, MD, FCPS"
                  defaultValue={
                    state?.formData?.qualification ||
                    (isEdit ? doctor?.qualification : "")
                  }
                  className="h-10"
                  disabled={pending}
                />
                <InputFieldError state={state} field="qualification" />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="currentWorkingPlace"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Current Working Place
                </FieldLabel>
                <Input
                  id="currentWorkingPlace"
                  name="currentWorkingPlace"
                  placeholder="City Hospital"
                  defaultValue={
                    state?.formData?.currentWorkingPlace ||
                    (isEdit ? doctor?.currentWorkingPlace : "")
                  }
                  className="h-10"
                  disabled={pending}
                />
                <InputFieldError state={state} field="currentWorkingPlace" />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="designation"
                  className="flex items-center gap-2"
                >
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  Designation
                </FieldLabel>
                <Input
                  id="designation"
                  name="designation"
                  placeholder="Senior Consultant"
                  defaultValue={
                    state?.formData?.designation ||
                    (isEdit ? doctor?.designation : "")
                  }
                  className="h-10"
                  disabled={pending}
                />
                <InputFieldError state={state} field="designation" />
              </Field>
            </div>

            {/* ── Profile Photo (Create only) ── */}
            {!isEdit && (
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                  Profile Photo
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
                      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-background shadow-sm">
                        <Image
                          src={URL.createObjectURL(selectedFile)}
                          alt="Profile preview"
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
                        <Camera className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Click to upload photo
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          PNG, JPG up to a few MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <InputFieldError state={state} field="profilePhoto" />
              </Field>
            )}
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
              className="min-w-[130px]"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Doctor"
              ) : (
                "Create Doctor"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorFormDialog;