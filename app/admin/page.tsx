import { redirect } from "next/navigation";
import { adminRoutes } from "@/lib/admin-routes";

export default function Page() {
  redirect(adminRoutes.overview);
}
