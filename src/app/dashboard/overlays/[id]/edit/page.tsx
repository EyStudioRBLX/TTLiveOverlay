import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Overlay from "@/models/Overlay";
import OverlayEditor from "@/components/OverlayEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditOverlayPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.discordId) redirect("/login");

  const { id } = await params;
  await connectDB();

  const raw = await Overlay.findOne({
    _id: id,
    discordId: session.user.discordId,
  }).lean();

  if (!raw) notFound();

  const overlay = raw as typeof raw & { _id: { toString(): string } };

  return (
    <OverlayEditor
      initialOverlay={{
        _id: overlay._id.toString(),
        name: overlay.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        elements: overlay.elements as any,
      }}
    />
  );
}
