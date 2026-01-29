import Image from "next/image";
import { Label, RadioGroup, RadioGroupItem } from "@/components/ui";
import { getAvailabilityAttendances } from "@/services";
import { AvailabilityAttendance, User } from "@prisma/client";

export default async function PatientAvailabilityAttendancePage() {
  const availabilityAttendancesResult = await getAvailabilityAttendances({
    select: {
      id: true,
      startAt: true,
      endAt: true,
      professionalId: true,
      professional: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    where: {
      startAt: { gte: new Date() },
      isBooked: false,
    },
    orderBy: { startAt: "asc" },
  });

  const availabilityAttendances = (availabilityAttendancesResult.data ||
    []) as (AvailabilityAttendance & {
    professional: User;
  })[];
  availabilityAttendances.sort((a, b) =>
    (a.professional.name || "").localeCompare(b.professional.name || ""),
  );

  let lastProfessionalId: string | null = null;

  return (
    <>
      <h2 className="text-center">Vamos reservar um horário na agenda?</h2>
      <p className="font-young-serif text-xl text-center">
        Para um agendamento mais ágil e acessível, nossa equipe de assistentes
        sociais precisa falar com você!
      </p>
      <h3 className="text-center">Escolha o horário</h3>
      <form className="flex flex-col">
        <RadioGroup name="availabilityAttendanceId" className="w-full">
          {availabilityAttendances.map((availabilityAttendance) => {
            const showProfessionalName =
              availabilityAttendance.professionalId !== lastProfessionalId;
            lastProfessionalId = availabilityAttendance.professionalId;

            return (
              <div
                key={availabilityAttendance.id}
                className="flex flex-col gap-2"
              >
                {showProfessionalName && (
                  <div className="flex justify-center items-center w-full gap-2 mt-4 mb-2">
                    <Image
                      key={availabilityAttendance.professionalId}
                      src={
                        availabilityAttendance.professional.image ??
                        "/default-user.jpg"
                      }
                      alt={`Avatar de ${availabilityAttendance.professional.name}`}
                      width={132}
                      height={132}
                      className="rounded-full border-1 border-s-navy-100 p-0.25 w-32 h-32 object-cover"
                    />
                    <p className="font-poppins font-extrabold text-xl text-s-tuscan-sun">
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
                    className="font-young-serif text-lg"
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
        </RadioGroup>
      </form>
    </>
  );
}
