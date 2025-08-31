import Image from "next/image";

import { auth } from "@/auth";
import { ButtonSignOut } from "@/components/ui";

export default async function MeuPerfilPage() {
  const session = await auth();

  if (!session) throw new Error("User not authenticated");

  return (
    <div>
      <p>name: {session.user?.name}</p>
      <p>email: {session.user?.email}</p>
      <p>role: {session.user?.role.join(", ")}</p>
      <p>image: {session.user?.image}</p>
      <Image
        src={session.user?.image ?? "/default-user.jpg"}
        alt="User Image"
        width={100}
        height={100}
      />
      <p>expires: {session.expires}</p>
      <ButtonSignOut />
    </div>
  );
}
