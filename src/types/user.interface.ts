import { UserRole } from "@/lib/auth-utils";
import { IDoctor } from "./doctor.interface";
import { IPatient } from "./patient.interface";
import { IAdmin } from "./admin.interface";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  needPasswordChange: boolean;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  admin?: IAdmin;
  patient?: IPatient;
  doctor?: IDoctor;
  createdAt: string;
  updatedAt: string;
}
