"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadMedicalReportSchema } from "@/zod/patient.validation";
import { z } from "zod";
import { uploadMedicalReport } from "@/services/patient/health-records.service";
import { toast } from "sonner";
import { Cloud, File, Loader2, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type UploadReportInput = z.infer<typeof uploadMedicalReportSchema>;

export default function UploadReportModal({
  open,
  onOpenChange,
  onSuccess,
}: UploadReportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<UploadReportInput>({
    resolver: zodResolver(uploadMedicalReportSchema),
    defaultValues: {
      reportName: "",
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and PDF files are allowed.");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    setFileName(file.name);
    form.setValue("report", file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  async function onSubmit(data: UploadReportInput) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("report", data.report);
      formData.append("reportName", data.reportName);

      const response = await uploadMedicalReport(formData);

      if (response.success) {
        toast.success("Medical report uploaded successfully");
        form.reset();
        setFileName("");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(
          response.message || "Failed to upload report. Try again.",
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Medical Report</DialogTitle>
          <DialogDescription>
            Upload your medical reports (PDF, JPEG, or PNG). Maximum file size:
            5MB.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload Area */}
            <FormField
              control={form.control}
              name="report"
              render={() => (
                <FormItem>
                  <FormLabel>Medical Report File</FormLabel>
                  <FormControl>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        isDragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-muted-foreground/50"
                      }`}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileInputChange}
                        disabled={isLoading}
                      />

                      {fileName ? (
                        <div className="flex items-center justify-center gap-2">
                          <File className="h-6 w-6 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              Click or drag to replace
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFileName("");
                              form.resetField("report");
                            }}
                            className="absolute right-2 top-2"
                          >
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Cloud className="mx-auto h-8 w-8 text-muted-foreground" />
                          <label
                            htmlFor="file-upload"
                            className="mt-2 block cursor-pointer"
                          >
                            <span className="text-sm font-medium text-primary hover:underline">
                              Click to upload
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {" "}
                              or drag and drop
                            </span>
                          </label>
                          <p className="text-xs text-muted-foreground">
                            PDF, JPEG, or PNG up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Report Name */}
            <FormField
              control={form.control}
              name="reportName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Blood Test Report - January 2024"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Size Note */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Supported formats: PDF, JPEG, PNG. Maximum size: 5MB
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                  setFileName("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !fileName}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Report
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}