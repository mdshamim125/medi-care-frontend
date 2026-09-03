"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";

// Get patient profile with health data and medical reports
export async function getMyProfile() {
  try {
    const response = await serverFetch.get("/patient/my-profile");
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching patient profile:", error);
    return {
      success: false,
      data: null,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch profile",
    };
  }
}

// Get patient health data
export async function getMyHealthData() {
  try {
    const response = await serverFetch.get("/patient/my-health-data");
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching health data:", error);
    return {
      success: false,
      data: null,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch health data",
    };
  }
}

// Get medical reports
export async function getMyMedicalReports() {
  try {
    const response = await serverFetch.get("/patient/my-medical-reports");
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching medical reports:", error);
    return {
      success: false,
      data: [],
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch medical reports",
    };
  }
}

export async function deleteMedicalReport(reportId: string) {
  try {
    const response = await serverFetch.delete(
      `/patient/my-medical-reports/${reportId}`,
    );
    return await response.json();
  } catch (error: any) {
    console.error("Error deleting medical report:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to delete medical report",
    };
  }
}

// Get patients who have paid appointments with the signed-in doctor
export async function getDoctorPatients() {
  try {
    const response = await serverFetch.get("/patient/my-paid-patients");
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching doctor patients:", error);
    return {
      success: false,
      data: [],
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch appointed patients",
    };
  }
}

// Get a complete patient record visible to the signed-in doctor
export async function getDoctorPatientById(patientId: string) {
  try {
    const response = await serverFetch.get(
      `/patient/doctor-patient/${patientId}`,
    );
    const result = await response.json();

    if (result?.data?.appointment) {
      result.data.appointments = result.data.appointment;
      delete result.data.appointment;
    }

    return result;
  } catch (error: any) {
    console.error("Error fetching doctor patient:", error);
    return {
      success: false,
      data: null,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch patient details",
    };
  }
}

// Update health data
export async function updateHealthData(data: any) {
  try {
    const response = await serverFetch.patch("/patient/update-health-data", {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error updating health data:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update health data",
    };
  }
}

// Upload medical report
export async function uploadMedicalReport(formData: FormData) {
  try {
    const file = formData.get("report");
    const reportName = formData.get("reportName");
    const requestData = new FormData();

    if (file instanceof File) {
      requestData.append("file", file);
    }
    requestData.append("data", JSON.stringify({ reportName }));

    const response = await serverFetch.post("/patient/upload-medical-report", {
      body: requestData,
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error uploading medical report:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to upload medical report",
    };
  }
}
