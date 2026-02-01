import { BackNavigationHeader } from "@/components/ui";
import UserListFilterPage from "./filter";

export default async function UserListPage() {
  return (
    <>
      <BackNavigationHeader title="Usuários" href="/employee/home" />
      <section className="flex flex-col gap-6">
        <UserListFilterPage />
      </section>
    </>
  );
}
