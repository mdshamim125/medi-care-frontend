"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/formatters";
import { updateMyProfile } from "@/services/auth/auth.service";
import { UserInfo } from "@/types/user.interface";
import { Camera, CheckCircle2, Loader2, Save, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface MyProfileProps {
  userInfo: UserInfo;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getProfilePhoto = () => {
    if (userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN") {
      return userInfo.admin?.profilePhoto;
    } else if (userInfo.role === "DOCTOR") {
      return userInfo.doctor?.profilePhoto;
    } else if (userInfo.role === "PATIENT") {
      return userInfo.patient?.profilePhoto;
    }
    return null;
  };

  const getProfileData = () => {
    if (userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN") {
      return userInfo.admin;
    } else if (userInfo.role === "DOCTOR") {
      return userInfo.doctor;
    } else if (userInfo.role === "PATIENT") {
      return userInfo.patient;
    }
    return null;
  };

  const profilePhoto = getProfilePhoto();
  const profileData = getProfileData();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateMyProfile(formData);

      if (result.success) {
        setSuccess(result.message);
        setPreviewImage(null);
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/70 px-5 py-6 sm:px-7">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Account center
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              My Profile
            </h1>
            <p className="mt-1.5 text-sm text-teal-900/70">
              Keep your personal and professional information up to date.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-teal-100 bg-white/80 px-3 py-2 text-xs font-semibold text-teal-800 sm:self-center">
            <ShieldCheck className="h-4 w-4" />
            {userInfo.role.replace("_", " ")}
          </div>
        </div>
        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[18px] border-white/40" />
      </section>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {/* Profile Card */}
          <Card className="overflow-hidden border-slate-200/80 shadow-sm lg:col-span-1">
            <CardHeader className="border-b border-slate-100 bg-slate-50/60 pb-4">
              <CardTitle className="text-base">Profile identity</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-5 pt-6">
              <div className="relative">
                <Avatar className="h-32 w-32 ring-4 ring-teal-50 ring-offset-2">
                  {previewImage || profilePhoto ? (
                    <AvatarImage
                      src={previewImage || (profilePhoto as string)}
                      alt={userInfo.name}
                    />
                  ) : (
                    <AvatarFallback className="text-3xl">
                      {getInitials(userInfo.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label
                  htmlFor="file"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <Input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isPending}
                  />
                </label>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-slate-900">
                  {userInfo.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {userInfo.email}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Profile active
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card className="border-slate-200/80 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-slate-100 bg-slate-50/60 pb-4">
              <CardTitle className="text-base">Personal information</CardTitle>
              <p className="text-sm text-slate-500">
                Update the details shown across your MediCare account.
              </p>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 text-green-600 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}

              <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
                {/* Common Fields for All Roles */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={profileData?.name || userInfo.name}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    defaultValue={profileData?.contactNumber || ""}
                    required
                    disabled={isPending}
                  />
                </div>

                {/* Doctor-Specific Fields */}
                {userInfo.role === "DOCTOR" && userInfo.doctor && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={userInfo.doctor.address || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">
                        Registration Number
                      </Label>
                      <Input
                        id="registrationNumber"
                        name="registrationNumber"
                        defaultValue={userInfo.doctor.registrationNumber || ""}
                        required
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (Years)</Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        defaultValue={userInfo.doctor.experience || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appointmentFee">Appointment Fee</Label>
                      <Input
                        id="appointmentFee"
                        name="appointmentFee"
                        type="number"
                        defaultValue={userInfo.doctor.appointmentFee || ""}
                        required
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input
                        id="qualification"
                        name="qualification"
                        defaultValue={userInfo.doctor.qualification || ""}
                        required
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentWorkingPlace">
                        Current Working Place
                      </Label>
                      <Input
                        id="currentWorkingPlace"
                        name="currentWorkingPlace"
                        defaultValue={userInfo.doctor.currentWorkingPlace || ""}
                        required
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        name="designation"
                        defaultValue={userInfo.doctor.designation || ""}
                        required
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        name="gender"
                        defaultValue={userInfo.doctor.gender || "MALE"}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isPending}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Patient-Specific Fields */}
                {userInfo.role === "PATIENT" && userInfo.patient && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={userInfo.patient.address || ""}
                      disabled={isPending}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-5">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
