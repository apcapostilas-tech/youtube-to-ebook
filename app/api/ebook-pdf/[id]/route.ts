import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job?.ebook) return NextResponse.json({ error: "Ebook não encontrado" }, { status: 404 });

  const origin = request.nextUrl.origin;
  const ebookUrl = `${origin}/ebook/${id}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(ebookUrl, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfData = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
    });

    const filename = job.ebook.title.replace(/[^a-z0-9]/gi, "_") + ".pdf";
    return new NextResponse(Buffer.from(pdfData), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } finally {
    await browser.close();
  }
}
