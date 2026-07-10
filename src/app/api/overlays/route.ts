import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
import Overlay from "@/models/Overlay";

export async function GET() {
  const session = await auth();
  if (!session?.user?.discordId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const overlays = await Overlay.find({ discordId: session.user.discordId })
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({ overlays });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.discordId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  const overlay = await Overlay.create({
    discordId: session.user.discordId,
    name: body.name ?? "Neues Overlay",
    elements: body.elements ?? [],
  });

  return NextResponse.json({ overlay }, { status: 201 });
}
