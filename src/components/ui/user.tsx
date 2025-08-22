import { format } from "date-fns";
import { TZDateMini } from "@date-fns/tz";
import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { User } from "@prisma/client";

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
