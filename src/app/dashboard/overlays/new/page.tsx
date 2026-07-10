import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OverlayEditor from "@/components/OverlayEditor";

export default async function NewOverlayPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <OverlayEditor />;
}
