import Image from "next/image";

import { auth } from "@/auth";
import { ButtonSignOut } from "@/components/ui";

export default async function MeuPerfilPage() {
  const session = await auth();

  if (!session) throw new Error("User not authenticated");

  return (
    <div>
      <p>id: {session.user?.id}</p>
      <p>name: {session.user?.name}</p>
      <p>email: {session.user?.email}</p>
      <p>role: {session.user?.role}</p>
      <p>image: {session.user?.image}</p>
      {session.user?.image && (
        <Image
          src={session.user?.image}
          alt="User Image"
          width={100}
          height={100}
        />
      )}
      <p>expires: {session.expires}</p>
      <ButtonSignOut />
    </div>
  );
}
