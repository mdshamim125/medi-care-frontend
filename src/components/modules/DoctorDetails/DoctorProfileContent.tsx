import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDoctor } from "@/types/doctor.interface";
import {
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  Hospital,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

interface DoctorProfileContentProps {
  doctor: IDoctor;
}

const DoctorProfileContent = ({ doctor }: DoctorProfileContentProps) => {
  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-primary/15 shadow-sm">
        <div className="h-28 bg-linear-to-br from-primary/15 via-primary/5 to-card md:h-36" />
        <CardContent className="relative px-5 pb-7 md:px-8">
          <div className="-mt-16 flex flex-col gap-5 md:-mt-20 md:flex-row md:items-end">
            <Avatar className="h-32 w-32 shrink-0 rounded-3xl border-4 border-card bg-card shadow-lg ring-1 ring-primary/15 md:h-40 md:w-40">
                {doctor.profilePhoto ? (
                  <AvatarImage
                    src={
                      typeof doctor.profilePhoto === "string"
                        ? doctor.profilePhoto
                        : undefined
                    }
                    alt={doctor.name}
                  />
                ) : (
                  <AvatarFallback className="rounded-3xl bg-primary/10 text-4xl font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

            <div className="min-w-0 flex-1 space-y-3 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Dr. {doctor.name}
                </h1>
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <p className="text-base text-muted-foreground">{doctor.designation}</p>

              {/* Specialties */}
              {doctor.doctorSpecialties &&
                doctor.doctorSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {doctor.doctorSpecialties.map((specialty) => (
                      <Badge key={specialty.specialitiesId} variant="secondary" className="font-medium">
                        {specialty.specialities?.title || "Specialty"}
                      </Badge>
                    ))}
                  </div>
                )}

              {/* Rating & Fee */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                {doctor.averageRating !== undefined && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{doctor.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">patient rating</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-primary">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">
                    ${doctor.appointmentFee}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    per visit
                  </span>
                </div>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span>{doctor.contactNumber}</span>
            </div>
            {doctor.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <span>{doctor.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-semibold">
                  {doctor.experience
                    ? `${doctor.experience} years`
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hospital className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Workplace
                </p>
                <p className="font-semibold">{doctor.currentWorkingPlace}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Registration Number
                </p>
                <p className="font-semibold">{doctor.registrationNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Qualification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Qualification & Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{doctor.qualification}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfileContent;
