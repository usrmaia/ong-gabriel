import Image from "next/image";
import { User, PsychStatus } from "@prisma/client";

import { BackNavigationHeader, CardUserProfile } from "@/components/ui";
import { getUserById } from "@/services";
import prisma from "@/lib/prisma";

export default async function PrePsychDetailsPage({
    params,
}: {
    params: { psychId: string };
}) {
    const { psychId } = params;
    const userResult = await getUserById(psychId);

    if (!userResult.success) return <p>Erro ao carregar detalhes do pré-psicólogo.</p>;

    const user = userResult.data as User;

    // Verifica se o usuário é um pré-psicólogo
    if (!user.role.includes("PREPSYCHO")) {
        return <p className="text-center">Usuário não é um psicólogo.</p>;
    }

    const psych = await prisma.psych.findUnique({
        where: { userId: user.id },
        select: { proofAddress: true, curriculumVitae: true, status: true },
    });

    return (
        <>
            <BackNavigationHeader title="Pré-Psicólogo" href="/admin/pre-psych/list" />
            <section className="flex flex-col gap-2">
                <div className="w-full flex flex-col items-center gap-2">
                    <Image
                        src={user.image ?? "/default-user.jpg"}
                        alt={`Avatar de ${user.name}`}
                        width={100}
                        height={100}
                        className="rounded-full border-1 border-p-tealwave p-0.25 w-14 h-14 object-cover"
                    />
                    <p className="font-poppins text-lg text-s-van-dyke">{user.name}</p>
                </div>
                <CardUserProfile user={user} />
                <h2 className="text-center">Documentos</h2>
                <a
                    href={psych?.curriculumVitae?.id}
                    rel="noreferrer"
                    target="_blank"
                    download={psych?.curriculumVitae?.id}>

                    {psych?.curriculumVitae?.name ?? "Sem currículo cadastrado."}
                </a>
                <a
                    href={psych?.proofAddress?.id}
                    rel="noreferrer"
                    target="_blank"
                    download={psych?.proofAddress?.id}>

                    {psych?.proofAddress?.name ?? "Sem endereço cadastrado."}
                </a>
            </section>
            <div className="mt-6 flex gap-4 justify-center">
                <form
                    action={async () => {
                        "use server";
                        await prisma.psych.update({
                            where: { userId: user.id },
                            data: { status: PsychStatus.APPROVED },
                        });
                    }}
                >
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Aprovar
                    </button>
                </form>
                <form
                    action={async () => {
                        "use server";
                        await prisma.psych.update({
                            where: { userId: user.id },
                            data: { status: PsychStatus.FAILED },
                        });
                    }}
                >
                    <button
                        type="submit"
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Reprovar
                    </button>
                </form>
                <form
                    action={async () => {
                        "use server";
                        await prisma.psych.update({
                            where: { userId: user.id },
                            data: { status: PsychStatus.ADJUSTMENT },
                        });
                    }}
                >
                    <button
                        type="submit"
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Ajustar
                    </button>
                </form>
            </div>
            <div className="mt-4 text-center">
                <span className="font-semibold">Status atual: </span>
                <span>
                    {psych?.status
                        ? psych.status === PsychStatus.APPROVED
                            ? "Aprovado"
                            : psych.status === PsychStatus.FAILED
                            ? "Reprovado"
                            : psych.status === PsychStatus.ADJUSTMENT
                            ? "Ajuste necessário"
                                    : psych.status === PsychStatus.PENDING
                            ? "Pendente"
                            : "Desconhecido"
                        : "Indefinido"}
                </span>
            </div>
        </>
    );
}