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

  if (el.type === "rectangle") {
    const border = (el.borderWidth ?? 0) > 0 ? `border:${el.borderWidth}px solid ${el.borderColor ?? "#818cf8"};` : "";
    const style = `${base}background:${el.fillColor ?? "#6366f1"};${border}border-radius:${el.borderRadius ?? 0}px;opacity:${(el.opacity ?? 100) / 100};`;
    return `<div style="${style}"></div>`;
  }

  if (el.type === "ellipse") {
    const border = (el.borderWidth ?? 0) > 0 ? `border:${el.borderWidth}px solid ${el.borderColor ?? "#818cf8"};` : "";
    const style = `${base}background:${el.fillColor ?? "#6366f1"};${border}border-radius:50%;opacity:${(el.opacity ?? 100) / 100};`;
    return `<div style="${style}"></div>`;
  }

  if (el.type === "line") {
    const style = `${base}background:${el.fillColor ?? "#ffffff"};opacity:${(el.opacity ?? 100) / 100};`;
    return `<div style="${style}"></div>`;
  }

  if (el.type === "triangle") {
    const style = `${base}background:${el.fillColor ?? "#6366f1"};clip-path:polygon(50% 0%,0% 100%,100% 100%);opacity:${(el.opacity ?? 100) / 100};overflow:visible;`;
    return `<div style="${style}"></div>`;
  }

  if (el.type === "star") {
    const style = `${base}background:${el.fillColor ?? "#f59e0b"};clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);opacity:${(el.opacity ?? 100) / 100};overflow:visible;`;
    return `<div style="${style}"></div>`;
  }

  if (el.type === "progressbar") {
    const val = Math.min(100, Math.max(0, el.progressValue ?? 50));
    const max = el.progressMax ?? 100;
    const stepText = el.progressStepFormat === "fraction"
      ? `${Math.round(val * max / 100)}/${max}`
      : `${Math.round(val)}%`;
    const animType = el.progressAnimationType ?? "spring";
    const dur = el.progressAnimationDuration ?? 1.5;
    const cssDur = animType === "none" ? "0s" : animType === "spring" ? "1.2s" : `${dur}s`;
    const cssTiming = animType === "spring" ? "cubic-bezier(0.34,1.56,0.64,1)" : "ease-out";
    const uid = el.id.replace(/-/g, "");

    const wrapStyle = `${base}opacity:${(el.opacity ?? 100) / 100};display:flex;flex-direction:column;`;
    const labelHtml = el.progressLabel
      ? `<div style="font-size:${el.progressLabelSize ?? 24}px;color:${el.progressLabelColor ?? "#ffffff"};font-family:${el.progressLabelFont ?? "Arial"},sans-serif;margin-bottom:6px;line-height:1.2;flex-shrink:0;">${el.progressLabel.replace(/</g, "&lt;")}</div>`
      : "";
    const trackStyle = `position:relative;flex:1;background:${el.trackColor ?? "#374151"};border-radius:${el.borderRadius ?? 4}px;overflow:hidden;min-height:0;`;
    const fillStyle = `id="pb${uid}" width:0%;height:100%;background:${el.fillColor ?? "#6366f1"};border-radius:${el.borderRadius ?? 4}px;transition:width ${cssDur} ${cssTiming};`;
    const stepInside = (el.progressStepVisible !== false) && el.progressStepPosition !== "below"
      ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:${el.progressStepColor ?? "#ffffff"};font-size:${el.progressStepSize ?? 18}px;font-weight:bold;">${stepText}</div>`
      : "";
    const stepBelow = (el.progressStepVisible !== false) && el.progressStepPosition === "below"
      ? `<div style="margin-top:4px;flex-shrink:0;color:${el.progressStepColor ?? "#ffffff"};font-size:${el.progressStepSize ?? 18}px;text-align:center;">${stepText}</div>`
      : "";

    return `<div style="${wrapStyle}">${labelHtml}<div style="${trackStyle}"><div id="pb${uid}" style="${fillStyle}"></div>${stepInside}</div>${stepBelow}</div>
<script>requestAnimationFrame(function(){var el=document.getElementById('pb${uid}');if(el)el.style.width='${val}%';});</script>`;
  }

  return "";
}

function htmlResponse(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  let overlay: { elements: IOverlayElement[] } | null = null;

  try {
    await connectDB();
    overlay = await Overlay.findById(id).lean() as { elements: IOverlayElement[] } | null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
    return htmlResponse(errorPage("Datenbankfehler", msg));
  }

  if (!overlay) {
    return htmlResponse(errorPage("Overlay nicht gefunden", `ID: ${id}`), 404);
  }

  const elementsHTML = overlay.elements.map(renderElement).join("\n");

  return htmlResponse(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Montserrat:wght@400;700&family=Oswald:wght@400;700&family=Raleway:wght@400;700&family=Bebas+Neue&family=Anton&family=Bangers&family=Orbitron:wght@400;700&family=Press+Start+2P&family=Permanent+Marker&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:transparent}
body{position:relative}
</style>
</head>
<body>
${elementsHTML}
</body>
</html>`);
}

function errorPage(title: string, detail: string) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:transparent;font-family:Arial,sans-serif}
.box{position:absolute;top:24px;left:24px;background:rgba(0,0,0,0.75);border:1px solid rgba(239,68,68,0.4);border-radius:12px;padding:16px 20px;max-width:600px}
h1{color:#f87171;font-size:18px;margin-bottom:6px}
p{color:#9ca3af;font-size:13px;word-break:break-all}
</style>
</head>
<body>
<div class="box">
  <h1>⚠ ${title}</h1>
  <p>${detail.replace(/</g, "&lt;")}</p>
</div>
</body>
</html>`;
}
