"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInitials } from "@/lib/formatters";
import { IDoctor } from "@/types/doctor.interface";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  DollarSign,
  Eye,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState, type ComponentType } from "react";
import BookAppointmentDialog from "./BookAppointmentDialog";

type BookAppointmentDialogProps = {
  doctor: IDoctor;
  isOpen: boolean;
  onClose: () => void;
};

const TypedBookAppointmentDialog =
  BookAppointmentDialog as unknown as ComponentType<BookAppointmentDialogProps>;

interface DoctorCard {
  doctor: IDoctor;
}

export default function DoctorCard({ doctor }: DoctorCard) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <>
      <Card className="group flex h-full flex-col overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
        <CardHeader className="border-b border-border/60 bg-linear-to-br from-primary/5 via-card to-card pb-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0 rounded-2xl border-2 border-background shadow-md ring-1 ring-primary/15">
              <AvatarImage src={doctor.profilePhoto || ""} alt={doctor.name} />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-1.5 text-lg leading-tight line-clamp-1">
                Dr. {doctor.name}
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-1 text-sm">
                {doctor.designation}
              </CardDescription>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">
                    {doctor.averageRating?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">rating</span>
                </div>
                {doctor.doctorSpecialties &&
                  doctor.doctorSpecialties.length > 0 && (
                    <Badge variant="secondary" className="max-w-full truncate text-xs font-medium">
                      {doctor.doctorSpecialties[0].specialities?.title}
                    </Badge>
                  )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/60 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <BriefcaseBusiness className="h-3.5 w-3.5" />
                Experience
              </div>
              <p className="text-sm font-semibold text-foreground">
                {doctor.experience || 0} years
              </p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" />
                Consultation
              </div>
              <p className="text-sm font-semibold text-primary">
                ${doctor.appointmentFee}
              </p>
            </div>
          </div>

          {doctor.currentWorkingPlace && (
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-2 leading-relaxed">{doctor.currentWorkingPlace}</span>
            </div>
          )}

          <div className="border-l-2 border-primary/25 pl-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Qualification
            </p>
            <p className="line-clamp-2 leading-relaxed text-muted-foreground">
              {doctor.qualification}
            </p>
          </div>

          {doctor.doctorSpecialties && doctor.doctorSpecialties.length > 1 && (
            <div className="flex flex-wrap gap-1">
              {doctor.doctorSpecialties.slice(1, 3).map((specialty) => (
                <Badge
                  key={specialty.specialitiesId}
                  variant="outline"
                  className="border-primary/20 text-xs text-primary"
                >
                  {specialty.specialities?.title}
                </Badge>
              ))}
              {doctor.doctorSpecialties.length > 3 && (
                <Badge variant="outline" className="border-primary/20 text-xs text-primary">
                  +{doctor.doctorSpecialties.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 border-t border-border/60 bg-muted/20 pt-4">
          <Link className="flex-1" href={`/consultation/doctor/${doctor.id}`}>
            <Button variant="outline" className="w-full border-border/80 bg-background/70">
              <Eye className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Button onClick={() => setShowScheduleModal(true)} className="group/button flex-1">
            Book
            <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
          </Button>
        </CardFooter>
      </Card>

      <TypedBookAppointmentDialog
        doctor={doctor}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </>
  );
}
