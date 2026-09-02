"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IPatientHealthData } from "@/types/patient.interface";
import { updateHealthDataSchema } from "@/zod/patient.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { updateHealthData } from "@/services/patient/health-records.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface HealthDataFormProps {
  healthData: IPatientHealthData | null | undefined;
  onSuccess?: () => void;
}

type UpdateHealthDataInput = z.infer<typeof updateHealthDataSchema>;

export default function HealthDataForm({
  healthData,
  onSuccess,
}: HealthDataFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateHealthDataInput>({
    resolver: zodResolver(updateHealthDataSchema),
    defaultValues: {
      gender: healthData?.gender || undefined,
      dateOfBirth: healthData?.dateOfBirth
        ? new Date(healthData.dateOfBirth).toISOString().split("T")[0]
        : undefined,
      bloodGroup: healthData?.bloodGroup || undefined,
      hasAllergies: healthData?.hasAllergies || false,
      hasDiabetes: healthData?.hasDiabetes || false,
      height: healthData?.height || "",
      weight: healthData?.weight || "",
      smokingStatus: healthData?.smokingStatus || false,
      dietaryPreferences: healthData?.dietaryPreferences || "",
      pregnancyStatus: healthData?.pregnancyStatus || false,
      mentalHealthHistory: healthData?.mentalHealthHistory || "",
      immunizationStatus: healthData?.immunizationStatus || "",
      hasPastSurgeries: healthData?.hasPastSurgeries || false,
      recentAnxiety: healthData?.recentAnxiety || false,
      recentDepression: healthData?.recentDepression || false,
      maritalStatus: healthData?.maritalStatus || undefined,
    },
  });

  async function onSubmit(data: UpdateHealthDataInput) {
    setIsLoading(true);

    try {
      const response = await updateHealthData(data);

      if (response.success) {
        toast.success("Health data updated successfully");
        onSuccess?.();
      } else {
        toast.error(
          response.message || "Failed to update health data. Try again.",
        );
      }
    } catch (error) {
      console.error("Health data update error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Health Information</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A_POSITIVE">A+</SelectItem>
                          <SelectItem value="A_NEGATIVE">A-</SelectItem>
                          <SelectItem value="B_POSITIVE">B+</SelectItem>
                          <SelectItem value="B_NEGATIVE">B-</SelectItem>
                          <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                          <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                          <SelectItem value="O_POSITIVE">O+</SelectItem>
                          <SelectItem value="O_NEGATIVE">O-</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="UNMARRIED">Unmarried</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Physical Measurements */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Physical Measurements</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (e.g., 180cm)</FormLabel>
                      <FormControl>
                        <Input placeholder="180cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (e.g., 75kg)</FormLabel>
                      <FormControl>
                        <Input placeholder="75kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Medical Conditions</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="hasAllergies"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Has Allergies</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasDiabetes"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Has Diabetes</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smokingStatus"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Smoker</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasPastSurgeries"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Past Surgeries</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pregnancyStatus"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Pregnant</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recentAnxiety"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Recent Anxiety</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recentDepression"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Recent Depression</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Additional Information</h3>

              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Vegetarian, Vegan"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Enter your dietary preferences
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="immunizationStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immunization Status</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Complete, Incomplete"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Your immunization status
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mentalHealthHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mental Health History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional: Any mental health conditions or treatments"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 border-t pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}