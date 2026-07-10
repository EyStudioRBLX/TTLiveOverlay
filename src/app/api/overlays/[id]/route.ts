import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
import Overlay from "@/models/Overlay";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.discordId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const overlay = await Overlay.findOne({
    _id: id,
    discordId: session.user.discordId,
  }).lean();

  if (!overlay)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ overlay });
}

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.discordId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  await connectDB();

  const overlay = await Overlay.findOneAndUpdate(
    { _id: id, discordId: session.user.discordId },
    { name: body.name, elements: body.elements },
    { new: true }
  );

  if (!overlay)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ overlay });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.discordId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  await Overlay.findOneAndDelete({ _id: id, discordId: session.user.discordId });

  return NextResponse.json({ ok: true });
}
