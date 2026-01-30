"use client";

import Image from "next/image";
import { AvailabilityAttendance, User } from "@prisma/client";
import { useActionState } from "react";

import { onSubmit } from "./actions";
import { Button, Label, RadioGroup, RadioGroupItem } from "@/components/ui";

export default function PatientAvailabilityAttendanceForm({
  availabilityAttendances,
  patientAttendanceId,
}: {
  availabilityAttendances: (AvailabilityAttendance & {
    professional: User;
  })[];
  patientAttendanceId: string;
}) {
  const [state, formAction] = useActionState(
    onSubmit.bind(null, patientAttendanceId),
    {
      success: false,
      error: { errors: [] },
    },
  );

  let lastProfessionalId: string | null = null;

  return (
    <form className="flex flex-col" action={formAction}>
      <h3 className="text-center mb-6">Escolha o horário</h3>
      <RadioGroup name="availabilityAttendanceId" className="w-full" required>
        <>
          {availabilityAttendances.map((availabilityAttendance) => {
            const showProfessionalName =
              availabilityAttendance.professionalId !== lastProfessionalId;
            lastProfessionalId = availabilityAttendance.professionalId;

            return (
              <div
                key={availabilityAttendance.id}
                className="flex flex-col gap-6"
              >
                {showProfessionalName && (
                  <div className="flex items-center w-full gap-4">
                    <Image
                      key={availabilityAttendance.professionalId}
                      src={
                        availabilityAttendance.professional.image ??
                        "/default-user.jpg"
                      }
                      alt={`Avatar de ${availabilityAttendance.professional.name}`}
                      width={132}
                      height={132}
                      className="rounded-full border-2 border-s-navy-100 p-0.25 w-32 h-32 object-cover"
                    />
                    <p className="font-poppins font-black text-xl text-s-tuscan-sun">
                      {availabilityAttendance.professional.name}
                    </p>
                  </div>
                )}

                <div className="flex justify-center items-center gap-4 border-2 border-dashed border-s-pearl-aqua rounded-4xl py-4 px-6 w-full">
                  <RadioGroupItem
                    id={availabilityAttendance.id}
                    value={availabilityAttendance.id}
                  />
                  <Label
                    htmlFor={availabilityAttendance.id}
                    className="font-poppins"
                  >
                    {availabilityAttendance.startAt.toLocaleDateString(
                      "pt-BR",
                      {},
                    )}{" "}
                    das{" "}
                    {availabilityAttendance.startAt.toLocaleTimeString(
                      "pt-BR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}{" "}
                    às{" "}
                    {availabilityAttendance.endAt.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Label>
                </div>
              </div>
            );
          })}

          <hr className="border-t-1 border-s-pearl-aqua my-2" />
          <div className="flex justify-center items-center gap-4 border-2 border-dashed border-s-pearl-aqua rounded-4xl py-4 px-6 w-full">
            <RadioGroupItem id={`-1`} value="" />
            <Label htmlFor={`-1`} className="font-poppins">
              Nenhum horário disponível
            </Label>
          </div>
        </>
      </RadioGroup>

      <Button className="mt-8" type="submit">
        Reservar horário
      </Button>

      <span role="alert" className="text-xs text-error text-center h-2">
        {state.error?.errors}
      </span>
    </form>
  );
}
