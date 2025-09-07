import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, UserRound } from "lucide-react";

import {
  BackNavigationHeader,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
} from "@/components/ui";
import { Psych, User } from "@prisma/client";
import { getPsychs } from "@/services";

export default async function PrePsychoListPage() {
  const psychresult = await getPsychs({
    select: {
      id: true,
      status: true,
      interviewed: true,
      hasXpSuicidePrevention: true,
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    where: { status: { in: ["PENDING", "ADJUSTMENT"] } },
    orderBy: { status: "desc" },
  });

  if (!psychresult.success) return <p>Unauthorized</p>;

  const psychs = psychresult.data as Array<Psych & { user: User }>;

  return (
    <>
      <BackNavigationHeader
        title="Novos Cadastros à Psicólogo"
        href="/employee/home"
      />
      <section className="grid grid-cols-1 gap-6">
        {psychs.map((psych) => (
          <Card
            key={psych.user.email}
            className="w-full flex flex-row items-center justify-between border-1 border-s-butter-200 rounded-2xl h-50  px-4 py-0"
          >
            <CardContent className="flex flex-col gap-4  bg-amber-400">
              <div className="flex flex-row gap-3 items-center">
                <Image
                  src={psych.user.image ?? "/default-user.jpg"}
                  alt={`${psych.user.name}'s avatar`}
                  width={32}
                  height={32}
                  className="rounded-full border-1 border-p-xanthous p-0.25"
                />

                <div>
                  <p className="text-lg font-medium font-poppins">
                    {psych.user.name?.split(" ")?.slice(0, 2)?.join(" ")}
                  </p>

                  <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-2">
                      <MapPin color="#AFC6E1" size={16} />
                      <p className="text-xs font-light text-s-van-dyke font-poppins">
                        {psych.user.name?.split(" ")?.slice(0, 2)?.join(" ")}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      <UserRound size={16} color="#AFC6E1" />
                      <p className="text-xs font-light text-s-van-dyke font-poppins">
                        {psych.user.name?.split(" ")?.slice(0, 2)?.join(" ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-4">
                {psych.hasXpSuicidePrevention && (
                  <Badge
                    variant={"outline"}
                    className="text-success border-success "
                  >
                    Experiência
                  </Badge>
                )}
                {psych.interviewed && (
                  <Badge
                    variant={"outline"}
                    className="text-limited border-limited "
                  >
                    Entrevistado
                  </Badge>
                )}
              </div>
              <Badge className="text-s-charcoal-100 bg-amber-500 ">
                Atualizado
              </Badge>
            </CardContent>

            <Link href={`/admin/pre-psych/details/${psych.id}`}>
              <CardAction>
                <Button className="p-2 rounded-full bg-amber-500 w-10 h-10">
                  <ArrowRight color="#43300E" />
                </Button>
              </CardAction>
            </Link>
          </Card>
        ))}
      </section>
    </>
  );
}
