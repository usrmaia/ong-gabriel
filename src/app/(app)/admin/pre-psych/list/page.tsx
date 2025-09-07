// import Image from "next/image";
// import Link from "next/link";

// import { BackNavigationHeader, Card, CardContent } from "@/components/ui";
// import { getPsychByUserId } from "@/services";
// import { MapPin, UserRound } from "lucide-react";
// import { Psych, User } from "@prisma/client";

// export default async function PrepsychoListPage({
//   params,
// }: {
//   params: Promise<{ userId: string }>;
// }) {
//   const { userId } = await params;

//   const psychresult = await getPsychByUserId(userId, {
//     include: { user: true },
//   });

//   if (psychresult.success) return <p>No pre-psychologists found.</p>;

//   const psych = psychresult.data as Psych & {
//     user: User[];
//   };

//   return (
//     <>
//       <BackNavigationHeader
//         title="Novos Cadastros de Psicólogo"
//         href="/employee/home"
//       />
//       <section className="grid gap-6">
//         {/* {prepsychos.map((prepsycho) => ( */}
//         <Link href={""} key={psych.id}>
//           <Card
//             key={psych.user[0].email}
//             className="shadow-lg w-full border-0 rounded-lg h-[135px] p-1 pt-6"
//           >
//             {/* <CardContent className="flex flex-row gap-3">
//               <Image
//                 src={prepsycho.image ?? "/default-user.jpg"}
//                 alt={`${prepsycho.name}'s avatar`}
//                 width={36}
//                 height={36}
//                 className="rounded-full border-1 border-p-tealwave p-0.25"
//               />
//               <p className="text-xl font-medium text-s-van-dyke font-poppins">
//                 {prepsycho.name?.split(" ")?.slice(0, 2)?.join(" ")}
//               </p>
//             </CardContent>
//             <CardContent className="flex flex-row gap-3">
//               <MapPin size={16} color="rgba(175, 198, 225, 1)" />

//               <p className="text-xs  text-s-van-dyke font-light">
//                 {prepsycho?.split(" ")?.slice(0, 2)?.join(" ")}
//               </p>

//               <UserRound />

//               <p className="text-xs  text-s-van-dyke font-light">
//                 {prepsycho.full_name?.split(" ")?.slice(0, 2)?.join(" ")}
//               </p>
//             </CardContent> */}
//           </Card>
//         </Link>
//         {/* ))} */}
//       </section>
//     </>
//   );
// }

import Image from "next/image";
import Link from "next/link";

import {
  BackNavigationHeader,
  Button,
  Card,
  CardContent,
} from "@/components/ui";
import { getUsers } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";
import { ArrowRight, MapPin, UserRound } from "lucide-react";

export default async function PrepsychoListPage() {
  const user = await getUserAuthenticated();
  const isAdmin = user.role.includes("ADMIN");
  const patientsResult = await getUsers({
    where: {
      role: { has: "PATIENT" },
      PatientAttendancePatient: {
        some: isAdmin ? undefined : { professionalId: user.id },
      },
    },
  });
  const patients = patientsResult.data || [];

  return (
    <>
      <BackNavigationHeader
        title="Novos Cadastros de Psicólogo"
        href="/employee/home"
      />
      <section className="grid grid-cols-1 gap-6">
        {patients.map((patient) => (
          <Link
            href={`/employee/patient/details/${patient.id}`}
            key={patient.id}
          >
            <Card
              key={patient.email}
              className="w-full flex flex-row items-center border-1 border-s-butter-200 rounded-2xl h-[200px] "
            >
              {/* Conteúdo à esquerda */}
              <CardContent className="flex flex-col gap-4 ">
                <div className="flex flex-row gap-3 items-center">
                  <Image
                    src={patient.image ?? "/default-user.jpg"}
                    alt={`${patient.name}'s avatar`}
                    width={32}
                    height={32}
                    className="rounded-full border-1 border-p-xanthous p-0.25"
                  />

                  <div>
                    <p className="text-lg font-medium font-poppins">
                      {patient.name?.split(" ")?.slice(0, 2)?.join(" ")}
                    </p>

                    <div className="flex flex-row gap-4">
                      <div className="flex flex-row gap-2">
                        <MapPin color="#AFC6E1" size={16} />
                        <p className="text-xs font-light text-s-van-dyke font-poppins">
                          {patient.name?.split(" ")?.slice(0, 2)?.join(" ")}
                        </p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <UserRound size={16} color="#AFC6E1" />
                        <p className="text-xs font-light text-s-van-dyke font-poppins">
                          {patient.name?.split(" ")?.slice(0, 2)?.join(" ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-4">
                  <div className="rounded-full border-2 border-success px-4 py-1 text-xs">
                    <p className="text-xs text-success font-medium">
                      Com Experiência
                    </p>
                  </div>
                  <div className="rounded-full border-2 border-success px-4 py-1 text-xs">
                    <p className="text-xs text-success font-medium">
                      Não Entrevistado
                    </p>
                  </div>
                </div>

                <div className="w-fit font-semibold bg-amber-500 rounded-full px-4 py-1 text-xs">
                  <p className="text-s-charcoal-100">Atualizado</p>
                </div>
              </CardContent>

              {/* Botão alinhado à direita */}
              <div className=" w-full flex justify-center">
                <Button className="p-2 rounded-full bg-amber-500">
                  <ArrowRight color="#43300E" />
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
