import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, UserRound } from "lucide-react";

import {
  BackNavigationHeader,
  Badge,
  Button,
  Card,
  CardAction,
  CardDescription,
  CardTitle,
} from "@/components/ui";
import { Psych, User } from "@prisma/client";
import { getPsychs } from "@/services";

export const dynamic = "force-dynamic";

export default async function PrePsychoListPage() {
  const psychresult = await getPsychs({
    select: {
      id: true,
      CRP: true,
      status: true,
      interviewed: true,
      hasXpSuicidePrevention: true,
      city: true,
      state: true,
      user: {
        select: {
          id: true,
          name: true,
          full_name: true,
          email: true,
          image: true,
        },
      },
    },
    where: { status: { in: ["PENDING", "ADJUSTMENT"] } },
    orderBy: { status: "desc" },
  });

  if (!psychresult.success) return <p>{psychresult.error?.errors}</p>;

  const psychs = psychresult.data as Array<Psych & { user: User }>;

  return (
    <>
      <BackNavigationHeader
        title="Novos Cadastros de Psicólogo"
        href="/employee/home"
      />
      <section className="flex flex-col gap-4">
        {psychs.map((psych) => (
          <Link
            key={psych.user.email}
            href={`/admin/pre-psych/details/${psych.id}`}
          >
            <Card className="flex flex-col gap-1 border-s-butter-200 h-44 py-3 px-4 relative">
              <CardTitle className="flex flex-row gap-3 h-20">
                <Image
                  src={psych.user.image ?? "/default-user.jpg"}
                  alt={`${psych.user.name}'s avatar`}
                  width={64}
                  height={64}
                  className="rounded-full border-1 border-p-xanthous p-0.25 w-12 h-12"
                />

                <div className="flex flex-col gap-2">
                  <p className="text-lg font-medium font-poppins">
                    {psych.user.full_name ?? psych.user.name}
                  </p>

                  <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-1">
                      <UserRound size={16} color="#AFC6E1" />
                      <p className="text-xs text-nowrap font-light text-s-van-dyke font-poppins">
                        CRP: {psych.CRP.replace(/^(\d{2})(\d{6})$/, "$1/$2")}
                      </p>
                    </div>
                    <div className="flex flex-row gap-1">
                      <MapPin color="#AFC6E1" size={16} />
                      <p className="text-xs font-light text-s-van-dyke font-poppins">
                        {psych.city} {psych.state}
                      </p>
                    </div>
                  </div>
                </div>
              </CardTitle>

              <CardDescription className="flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  {psych.hasXpSuicidePrevention && (
                    <Badge
                      variant={"outline"}
                      className="text-success border-success"
                    >
                      Com Experiência
                    </Badge>
                  )}
                  {psych.interviewed && (
                    <Badge
                      variant={"outline"}
                      className="text-limited border-limited"
                    >
                      Entrevistado
                    </Badge>
                  )}
                </div>
                {psych.status == "ADJUSTMENT" && (
                  <Badge className="text-s-charcoal-100 bg-amber-500">
                    Atualizado
                  </Badge>
                )}
                {psych.status == "PENDING" && (
                  <Badge className="text-s-charcoal-100 bg-available">
                    Aguardando
                  </Badge>
                )}
              </CardDescription>

              <CardAction className="absolute right-4 top-2/3 transform -translate-y-1/2">
                <Button className="p-2 rounded-full bg-amber-500 w-10 h-10">
                  <ArrowRight color="#43300E" />
                </Button>
              </CardAction>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
