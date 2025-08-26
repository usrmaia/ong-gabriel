import { format } from "date-fns";
import { TZDateMini } from "@date-fns/tz";
import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export const CardUserProfile = ({ user }: { user: User }) => (
  <Card className="shadow-lg w-full py-4 border-0 rounded-lg">
    <CardContent className="flex flex-col gap-2 text-s-van-dyke text-sm font-poppins">
      <div className="flex gap-2">
        <Mail />
        <span>{user.email}</span>
      </div>
      <div className="flex gap-2">
        <Phone />
        <span>{user.phone || "N/A"}</span>
      </div>
      <p>
        <span className="font-bold">Data de Nascimento: </span>
        {user.date_of_birth
          ? format(new TZDateMini(user.date_of_birth, "UTC"), "dd/MM/yyyy")
          : "N/A"}
      </p>
    </CardContent>
  </Card>
);

interface CardUserAvatarProps {
  user: User;
  href: string;
}

export const CardUserAvatar = ({ user, href }: CardUserAvatarProps) => (
  <Link href={href}>
    <Card className="shadow-lg w-full px-2 py-4 border-0">
      <CardContent className="flex flex-row items-center gap-5 w-full">
        <Image
          src={user.image ?? "/default-user.jpg"}
          alt={`${user.name}'s avatar`}
          width={40}
          height={40}
          className="rounded-full border-1 border-p-tealwave p-0.25"
        />
        <div className="flex flex-col">
          <p className="font-raleway font-bold text-lg text-s-van-dyke">
            {user.name}
          </p>
        </div>
      </CardContent>
    </Card>
  </Link>
);
