import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Overlay, { IOverlayElement } from "@/models/Overlay";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function renderElement(el: IOverlayElement): string {
  const base = `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;overflow:hidden;box-sizing:border-box;`;

  if (el.type === "text") {
    const style = [
      base,
      `color:${el.color ?? "#ffffff"};`,
      `font-size:${el.fontSize ?? 60}px;`,
      `font-weight:${el.fontWeight ?? "bold"};`,
      `font-family:${el.fontFamily ?? "Arial"}, sans-serif;`,
      `text-align:${el.textAlign ?? "left"};`,
      `display:flex;align-items:center;`,
      `white-space:pre-wrap;word-break:break-word;line-height:1.2;`,
      `padding:0 4px;`,
    ].join("");
    const text = (el.content ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<div style="${style}">${text}</div>`;
  }

  if (el.type === "image" && el.src) {
    const imgStyle = `width:100%;height:100%;object-fit:${el.objectFit ?? "contain"};display:block;`;
    const src = el.src.replace(/"/g, "&quot;");
    return `<div style="${base}"><img src="${src}" alt="" style="${imgStyle}" /></div>`;
  }

  return "";
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  await connectDB();

  const overlay = await Overlay.findById(id).lean() as {
    elements: IOverlayElement[];
  } | null;

  if (!overlay) {
    return new NextResponse("Not found", { status: 404 });
  }

  const elementsHTML = overlay.elements.map(renderElement).join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{
  width:1920px;height:1080px;
  overflow:hidden;
  background:transparent;
}
body{position:relative}
</style>
</head>
<body>
${elementsHTML}
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
