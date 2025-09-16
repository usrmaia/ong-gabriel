import Image from "next/image";
import { User } from "@prisma/client";

import { BackNavigationHeader, CardUserProfile } from "@/components/ui";
import { getUserById } from "@/services";

export default async function PrePsychDetailsPage({
    params,
}: {
    params: Promise<{ psychId: string }>;
}) {
    const { psychId } = await params;
    const userResult = await getUserById(psychId);

    if (!userResult.success) return <p>Erro ao carregar detalhes do pré-psicólogo.</p>;

    const user = userResult.data as User;

    // Verifica se o usuário é um pré-psicólogo
    if (!user.role.includes("PREPSYCHO")) {
        return <p className="text-center">Usuário não é um psicólogo.</p>;
    }

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
            </section>
        </>
    );
}