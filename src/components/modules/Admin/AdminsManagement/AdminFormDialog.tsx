import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createAdmin, updateAdmin } from "@/services/admin/adminsManagement";
import { IAdmin } from "@/types/admin.interface";
import { Camera, Loader2, Mail, Phone, User, Lock } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface IAdminFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  admin?: IAdmin;
}

const AdminFormDialog = ({
  open,
  onClose,
  onSuccess,
  admin,
}: IAdminFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!admin?.id;

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateAdmin.bind(null, admin?.id as string) : createAdmin,
    null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handledStateRef = useRef<typeof state>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  // Handle success/error from server
  useEffect(() => {
    if (!state || handledStateRef.current === state) return;

    handledStateRef.current = state;

    if (state?.success) {
      toast.success(state.message || "Operation successful");
      if (formRef.current) {
        formRef.current.reset();
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null);
      onSuccess();
      onClose();
    } else if (state?.message && !state.success) {
      toast.error(state.message);

      // Restore file to input after error
      if (selectedFile && fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(selectedFile);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  }, [state, onSuccess, onClose, selectedFile]);

  const handleClose = () => {
    if (isPending) return;
    setSelectedFile(null);
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 gap-0 sm:max-w-[480px]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEdit ? "Edit Admin" : "Add New Admin"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Update the admin’s information below."
              : "Fill in the details to create a new admin account."}
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Name */}
            <Field>
              <FieldLabel htmlFor="name" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Name
              </FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                defaultValue={state?.formData?.name || admin?.name || ""}
                className="h-10"
                disabled={isPending}
              />
              <InputFieldError field="name" state={state} />
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email
              </FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                defaultValue={state?.formData?.email || admin?.email || ""}
                disabled={isEdit || isPending}
                className="h-10"
              />
              <InputFieldError field="email" state={state} />
            </Field>

            {/* Contact Number */}
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
                  state?.formData?.contactNumber || admin?.contactNumber || ""
                }
                className="h-10"
                disabled={isPending}
              />
              <InputFieldError field="contactNumber" state={state} />
            </Field>

            {/* Password (Create only) */}
            {!isEdit && (
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
                  disabled={isPending}
                />
                <InputFieldError field="password" state={state} />
              </Field>
            )}

            {/* Profile Photo (Create only) */}
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
                    isPending && "opacity-60 pointer-events-none",
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
                    disabled={isPending}
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
                        <p className="text-sm font-medium text-foreground truncate max-w-[220px]">
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

                <InputFieldError field="profilePhoto" state={state} />
              </Field>
            )}
          </div>

          {/* Footer Actions */}
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
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Admin"
              ) : (
                "Create Admin"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminFormDialog;