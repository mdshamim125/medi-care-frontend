"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPatientHealthData } from "@/types/patient.interface";
import { format } from "date-fns";
import {
  ActivitySquare,
  AlertCircle,
  Baby,
  Cigarette,
  Droplet,
  Heart,
  Ruler,
  Scale,
  Syringe,
  Pill,
  Wind,
  BrainCog,
} from "lucide-react";

interface HealthDataCardProps {
  healthData: IPatientHealthData | null | undefined;
}

export default function HealthDataCard({ healthData }: HealthDataCardProps) {
  if (!healthData) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            No Health Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No health data recorded yet. Add your health information to get
            started.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getBloodGroupDisplay = (group: string) => {
    return group.replace(/_/g, " ");
  };

  const getMaritalStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const healthMetrics = [
    {
      label: "Gender",
      value: healthData.gender,
      icon: ActivitySquare,
      color: "text-blue-500",
    },
    {
      label: "Date of Birth",
      value: format(new Date(healthData.dateOfBirth), "MMM dd, yyyy"),
      icon: Baby,
      color: "text-pink-500",
    },
    {
      label: "Blood Group",
      value: getBloodGroupDisplay(healthData.bloodGroup),
      icon: Droplet,
      color: "text-red-500",
    },
    {
      label: "Height",
      value: healthData.height,
      icon: Ruler,
      color: "text-green-500",
    },
    {
      label: "Weight",
      value: healthData.weight,
      icon: Scale,
      color: "text-orange-500",
    },
  ];

  const healthConditions = [
    {
      label: "Allergies",
      value: healthData.hasAllergies || false,
      icon: AlertCircle,
    },
    {
      label: "Diabetes",
      value: healthData.hasDiabetes || false,
      icon: Pill,
    },
    {
      label: "Smoking Status",
      value: healthData.smokingStatus || false,
      icon: Cigarette,
    },
    {
      label: "Past Surgeries",
      value: healthData.hasPastSurgeries || false,
      icon: Syringe,
    },
    {
      label: "Pregnancy Status",
      value: healthData.pregnancyStatus || false,
      icon: Heart,
    },
    {
      label: "Recent Anxiety",
      value: healthData.recentAnxiety || false,
      icon: Wind,
    },
    {
      label: "Recent Depression",
      value: healthData.recentDepression || false,
      icon: BrainCog,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {healthMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-start rounded-lg border p-4"
                >
                  <div className={`mb-2 ${metric.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{metric.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Health Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {healthConditions.map((condition, index) => {
              const Icon = condition.icon;
              const status = condition.value ? "Present" : "Not Present";
              const badgeVariant = condition.value ? "default" : "outline";
              const statusColor = condition.value ? "text-red-600" : "text-green-600";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{condition.label}</p>
                      <Badge variant={badgeVariant} className={`mt-1 ${statusColor}`}>
                        {status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Marital Status
              </p>
              <p className="mt-1 text-sm font-semibold">
                {healthData.maritalStatus
                  ? getMaritalStatusDisplay(healthData.maritalStatus)
                  : "Not specified"}
              </p>
            </div>

            {healthData.dietaryPreferences && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dietary Preferences
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {healthData.dietaryPreferences}
                </p>
              </div>
            )}

            {healthData.mentalHealthHistory && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mental Health History
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {healthData.mentalHealthHistory}
                </p>
              </div>
            )}

            {healthData.immunizationStatus && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Immunization Status
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {healthData.immunizationStatus}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Last updated:{" "}
                {format(new Date(healthData.updatedAt), "MMM dd, yyyy · hh:mm a")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
