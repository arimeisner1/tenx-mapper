"use client";

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

export async function exportToPng(
  elementId: string,
  filename: string
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Could not find the canvas element to export.");
      return;
    }

    toast.loading("Generating PNG...", { id: "export-png" });

    const dataUrl = await toPng(element, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();

    toast.success("PNG exported successfully!", { id: "export-png" });
  } catch (error) {
    console.error("Failed to export PNG:", error);
    toast.error("Failed to export as PNG. Please try again.", {
      id: "export-png",
    });
  }
}

export async function exportToPdf(
  elementId: string,
  filename: string,
  nodeMetadata: {
    name: string;
    description?: string | null;
    status?: string;
    costEstimate?: string | null;
    links?: unknown;
  }[]
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Could not find the canvas element to export.");
      return;
    }

    toast.loading("Generating PDF...", { id: "export-pdf" });

    const dataUrl = await toPng(element, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
    });

    const imgWidth = img.width;
    const imgHeight = img.height;

    // Determine orientation based on aspect ratio
    const landscape = imgWidth > imgHeight;
    const pdf = new jsPDF({
      orientation: landscape ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    // Scale image to fit within page
    const scale = Math.min(
      usableWidth / imgWidth,
      usableHeight / imgHeight
    );
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;
    const xOffset = margin + (usableWidth - scaledWidth) / 2;
    const yOffset = margin + (usableHeight - scaledHeight) / 2;

    // Title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(filename, margin, margin + 6);

    // Canvas image
    const imageYStart = margin + 14;
    const availableForImage = pageHeight - imageYStart - margin;
    const imgScale = Math.min(
      usableWidth / imgWidth,
      availableForImage / imgHeight
    );
    const finalWidth = imgWidth * imgScale;
    const finalHeight = imgHeight * imgScale;
    const imgX = margin + (usableWidth - finalWidth) / 2;

    pdf.addImage(dataUrl, "PNG", imgX, imageYStart, finalWidth, finalHeight);

    // Node metadata pages
    if (nodeMetadata.length > 0) {
      pdf.addPage("a4", "portrait");
      const metaPageWidth = pdf.internal.pageSize.getWidth();
      const metaMargin = 15;
      let y = metaMargin;

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Node Details", metaMargin, y + 6);
      y += 14;

      pdf.setDrawColor(200, 200, 200);

      for (const node of nodeMetadata) {
        // Check if we need a new page (leave room for at least one entry)
        if (y > 260) {
          pdf.addPage("a4", "portrait");
          y = metaMargin;
        }

        // Node name
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20, 20, 20);
        pdf.text(node.name, metaMargin, y);
        y += 6;

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80);

        // Description
        if (node.description) {
          const descLines = pdf.splitTextToSize(
            `Description: ${node.description}`,
            metaPageWidth - metaMargin * 2
          );
          pdf.text(descLines, metaMargin + 2, y);
          y += descLines.length * 4.5;
        }

        // Status
        if (node.status) {
          pdf.text(`Status: ${node.status}`, metaMargin + 2, y);
          y += 4.5;
        }

        // Cost
        if (node.costEstimate) {
          pdf.text(`Cost: ${node.costEstimate}`, metaMargin + 2, y);
          y += 4.5;
        }

        // Links
        if (node.links) {
          const linksArray = Array.isArray(node.links) ? node.links : [];
          if (linksArray.length > 0) {
            const linkStr = linksArray
              .map((l: { label?: string; url?: string }) =>
                l.label ? `${l.label} (${l.url})` : l.url || String(l)
              )
              .join(", ");
            const linkLines = pdf.splitTextToSize(
              `Links: ${linkStr}`,
              metaPageWidth - metaMargin * 2
            );
            pdf.text(linkLines, metaMargin + 2, y);
            y += linkLines.length * 4.5;
          }
        }

        // Separator line
        y += 3;
        pdf.setDrawColor(220, 220, 220);
        pdf.line(metaMargin, y, metaPageWidth - metaMargin, y);
        y += 6;
      }
    }

    pdf.save(`${filename}.pdf`);

    toast.success("PDF exported successfully!", { id: "export-pdf" });
  } catch (error) {
    console.error("Failed to export PDF:", error);
    toast.error("Failed to export as PDF. Please try again.", {
      id: "export-pdf",
    });
  }
}
