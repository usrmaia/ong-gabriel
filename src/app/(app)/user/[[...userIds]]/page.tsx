import { redirect } from "next/navigation";

// This route used to be used for debug purposes.
// The functional profile page lives at /user/profile.
export default function UserRedirectPage() {
  redirect("/user/profile");
}
