"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HealthDataCard from "./HealthDataCard";
import HealthDataForm from "./HealthDataForm";
import UploadReportModal from "./UploadReportModal";
import MedicalReportsTable from "./MedicalReportsTable";
import { IPatientHealthData, IMedicalReport } from "@/types/patient.interface";
import { Plus, Edit2 } from "lucide-react";
import {
  getMyHealthData,
  getMyMedicalReports,
} from "@/services/patient/health-records.service";

interface HealthRecordsClientProps {
  initialHealthData: IPatientHealthData | null;
  initialMedicalReports: IMedicalReport[];
}

export default function HealthRecordsClient({
  initialHealthData,
  initialMedicalReports,
}: HealthRecordsClientProps) {
  const [healthData, setHealthData] = useState<IPatientHealthData | null>(
    initialHealthData,
  );
  const [medicalReports, setMedicalReports] = useState<IMedicalReport[]>(
    initialMedicalReports,
  );
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    const [healthDataRes, reportsRes] = await Promise.all([
      getMyHealthData(),
      getMyMedicalReports(),
    ]);

    if (healthDataRes.success) {
      setHealthData(healthDataRes.data);
    }

    if (reportsRes.success) {
      setMedicalReports(reportsRes.data || []);
    }
  };

  const handleUploadSuccess = async () => {
    await fetchData();
    setActiveTab("reports");
  };

  const handleUpdateSuccess = async () => {
    await fetchData();
    setActiveTab("overview");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Records</h1>
          <p className="mt-1.5 text-muted-foreground">
            Manage your health information and medical reports
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Health Overview</TabsTrigger>
          <TabsTrigger value="edit">Update Information</TabsTrigger>
          <TabsTrigger value="reports">Medical Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <HealthDataCard healthData={healthData} />
          {healthData && (
            <Button
              onClick={() => setActiveTab("edit")}
              variant="outline"
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Update Health Data
            </Button>
          )}
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <HealthDataForm
            healthData={healthData}
            onSuccess={handleUpdateSuccess}
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-6 space-y-6">
          <MedicalReportsTable reports={medicalReports} onRefresh={fetchData} />
          {medicalReports.length > 0 && (
            <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Another Report
            </Button>
          )}
        </TabsContent>
      </Tabs>

      <UploadReportModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
