import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "./card";

export const CardMenu = (props: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => (
  <Link href={props.href}>
    <Card className="flex flex-col items-center justify-between gap-1 w-20 h-24 pt-5 bg-s-azure-web-100 hover:bg-s-verdigris">
      <CardHeader className="justify-center text-s-van-dyke">
        <CardTitle>{props.icon}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardTitle className="flex items-center text-center h-8 font-poppins text-s-liver-100 font-medium text-xs">
          {props.title}
        </CardTitle>
      </CardContent>
    </Card>
  </Link>
);
