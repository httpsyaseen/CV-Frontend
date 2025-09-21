import jsPDF from "jspdf";

// Define interfaces for the review data structure
interface ReviewSection {
  section_name: string;
  section_status: string;
  strengths: string[];
  weaknesses: string[];
  actionable_edits: string[];
  examples_bad_to_better: Array<{
    bad: string;
    better: string;
    why_better: string;
  }>;
  missing_content: string[];
  section_score: number;
  justification: string;
}

interface GlobalSummary {
  overall_readiness: string;
  top_fixes: string[];
  questions_for_user: string[];
  scoring_breakdown: Array<{
    section_name: string;
    score: number;
  }>;
  total_score: number;
}

interface RewrittenCVSection {
  section_name: string;
  content: string;
}

interface RewrittenCV {
  sections: RewrittenCVSection[];
}

interface ReviewMeta {
  version: string;
  notes: string;
  review_date: string;
}

interface ReviewData {
  _id: string;
  cvId: {
    _id: string;
    firstName: string;
    lastName: string;
    applyingForJobRole: string;
    targetMarkets: string[];
    serviceLevel: string;
    status: string;
    createdAt: string;
    fullName: string;
    id: string;
  };
  userId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
      };
  review_type: string;
  sections: ReviewSection[];
  global_summary: GlobalSummary;
  rewritten_cv: RewrittenCV;
  meta: ReviewMeta;
  status: string;
  reviewer_id:
    | string
    | { _id: string; firstName: string; lastName: string; email: string };
  createdAt: string;
  updatedAt: string;
  completed_at: string;
  __v: number;
  daysSinceCreation: number;
  turnaroundDays: number;
  id: string;
}

export const generateReviewPDF = (reviewData: ReviewData): jsPDF => {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number = 20) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
  };

  // Helper function to wrap text
  const wrapText = (
    text: string,
    maxWidth: number,
    fontSize: number = 10
  ): string[] => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, maxWidth);
  };

  // Helper function to add wrapped text
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10
  ): number => {
    const lines = wrapText(text, maxWidth, fontSize);
    doc.setFontSize(fontSize);
    const lineHeight = fontSize * 0.35;

    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + index * lineHeight);
    });

    return y + lines.length * lineHeight;
  };

  // Title Page
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CV Review Report", pageWidth / 2, currentY + 20, {
    align: "center",
  });

  currentY += 40;
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`Review for: ${reviewData.cvId.fullName}`, pageWidth / 2, currentY, {
    align: "center",
  });

  currentY += 10;
  doc.setFontSize(12);
  doc.text(
    `Review ID: ${reviewData._id.slice(-8).toUpperCase()}`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  currentY += 10;
  doc.text(
    `CV ID: ${reviewData.cvId._id.slice(-8).toUpperCase()}`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  currentY += 10;
  doc.text(
    `Service Level: ${
      reviewData.review_type.charAt(0).toUpperCase() +
      reviewData.review_type.slice(1)
    }`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  currentY += 10;
  doc.text(
    `Completed: ${new Date(reviewData.completed_at).toLocaleDateString()}`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  currentY += 10;
  doc.text(
    `Turnaround: ${reviewData.turnaroundDays} days`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  // Job Role and Target Markets
  currentY += 20;
  const jobRoleMap: Record<string, string> = {
    tier1: "Tier 1 (SHO, CT/ST1–2, FY2, JCF, CF, etc.)",
    middleGrade: "Middle Grade (Registrar, SpR, SCF, CF, etc.)",
    consultant: "Consultant",
  };
  const jobRole =
    jobRoleMap[reviewData.cvId.applyingForJobRole] ||
    reviewData.cvId.applyingForJobRole;

  const marketMap: Record<string, string> = {
    uk: "UK",
    republicOfIreland: "Ireland",
    europe: "Europe",
    america: "America",
    gcc: "GCC",
    others: "Others",
  };
  const targetMarkets = reviewData.cvId.targetMarkets
    .map((market) => marketMap[market] || market)
    .join(", ");

  doc.text(`Job Role: ${jobRole}`, pageWidth / 2, currentY, {
    align: "center",
  });
  currentY += 10;
  doc.text(`Target Markets: ${targetMarkets}`, pageWidth / 2, currentY, {
    align: "center",
  });

  // Add new page for content
  doc.addPage();
  currentY = margin;

  // Executive Summary
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", margin, currentY);
  currentY += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  currentY = addWrappedText(
    `Overall Readiness: ${reviewData.global_summary.overall_readiness}`,
    margin,
    currentY,
    contentWidth,
    12
  );
  currentY += 10;

  currentY = addWrappedText(
    `Total Score: ${reviewData.global_summary.total_score} out of ${
      reviewData.sections.length * 4
    }`,
    margin,
    currentY,
    contentWidth,
    12
  );
  currentY += 15;

  // Top Priority Fixes
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Top Priority Fixes:", margin, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  reviewData.global_summary.top_fixes.forEach((fix, index) => {
    checkPageBreak(15);
    currentY = addWrappedText(
      `${index + 1}. ${fix}`,
      margin + 5,
      currentY,
      contentWidth - 5,
      10
    );
    currentY += 5;
  });

  currentY += 10;

  // Section Scores Overview
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  checkPageBreak(20);
  doc.text("Section Scores Overview:", margin, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  reviewData.global_summary.scoring_breakdown.forEach((item) => {
    checkPageBreak(8);
    doc.text(`${item.section_name}: ${item.score}/4`, margin + 5, currentY);
    currentY += 7;
  });

  currentY += 15;

  // Detailed Section Analysis
  doc.addPage();
  currentY = margin;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Section Analysis", margin, currentY);
  currentY += 20;

  reviewData.sections.forEach((section, sectionIndex) => {
    // Section Header
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${sectionIndex + 1}. ${section.section_name}`, margin, currentY);
    currentY += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Status: ${section.section_status} | Score: ${section.section_score}/4`,
      margin + 5,
      currentY
    );
    currentY += 8;

    if (section.justification) {
      currentY = addWrappedText(
        `Justification: ${section.justification}`,
        margin + 5,
        currentY,
        contentWidth - 5,
        10
      );
      currentY += 5;
    }

    // Strengths
    if (section.strengths.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Strengths:", margin + 5, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      section.strengths.forEach((strength) => {
        checkPageBreak(15);
        currentY = addWrappedText(
          `• ${strength}`,
          margin + 10,
          currentY,
          contentWidth - 15,
          10
        );
        currentY += 3;
      });
      currentY += 5;
    }

    // Weaknesses
    if (section.weaknesses.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Weaknesses:", margin + 5, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      section.weaknesses.forEach((weakness) => {
        checkPageBreak(15);
        currentY = addWrappedText(
          `• ${weakness}`,
          margin + 10,
          currentY,
          contentWidth - 15,
          10
        );
        currentY += 3;
      });
      currentY += 5;
    }

    // Actionable Edits
    if (section.actionable_edits.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Actionable Edits:", margin + 5, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      section.actionable_edits.forEach((edit) => {
        checkPageBreak(15);
        currentY = addWrappedText(
          `• ${edit}`,
          margin + 10,
          currentY,
          contentWidth - 15,
          10
        );
        currentY += 3;
      });
      currentY += 5;
    }

    // Examples (Bad to Better)
    if (section.examples_bad_to_better.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Examples (Bad → Better):", margin + 5, currentY);
      currentY += 8;

      section.examples_bad_to_better.forEach((example, exampleIndex) => {
        checkPageBreak(40);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Example ${exampleIndex + 1}:`, margin + 10, currentY);
        currentY += 7;

        doc.setFont("helvetica", "normal");
        doc.text("Before:", margin + 10, currentY);
        currentY += 5;
        currentY = addWrappedText(
          example.bad,
          margin + 15,
          currentY,
          contentWidth - 20,
          9
        );
        currentY += 5;

        doc.text("After:", margin + 10, currentY);
        currentY += 5;
        currentY = addWrappedText(
          example.better,
          margin + 15,
          currentY,
          contentWidth - 20,
          9
        );
        currentY += 5;

        doc.text("Why better:", margin + 10, currentY);
        currentY += 5;
        currentY = addWrappedText(
          example.why_better,
          margin + 15,
          currentY,
          contentWidth - 20,
          9
        );
        currentY += 8;
      });
    }

    // Missing Content
    if (section.missing_content.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Missing Content:", margin + 5, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      section.missing_content.forEach((missing) => {
        checkPageBreak(10);
        currentY = addWrappedText(
          `• ${missing}`,
          margin + 10,
          currentY,
          contentWidth - 15,
          10
        );
        currentY += 3;
      });
    }

    currentY += 15;
  });

  // Questions for User
  if (reviewData.global_summary.questions_for_user.length > 0) {
    doc.addPage();
    currentY = margin;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Questions for Further Clarification", margin, currentY);
    currentY += 20;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    reviewData.global_summary.questions_for_user.forEach((question, index) => {
      checkPageBreak(15);
      currentY = addWrappedText(
        `${index + 1}. ${question}`,
        margin,
        currentY,
        contentWidth,
        10
      );
      currentY += 8;
    });
  }

  // Rewritten CV Sections
  if (reviewData.rewritten_cv?.sections?.length > 0) {
    doc.addPage();
    currentY = margin;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Rewritten CV Sections", margin, currentY);
    currentY += 20;

    reviewData.rewritten_cv.sections.forEach((section) => {
      checkPageBreak(25);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(section.section_name, margin, currentY);
      currentY += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      currentY = addWrappedText(
        section.content,
        margin + 5,
        currentY,
        contentWidth - 5,
        10
      );
      currentY += 15;
    });
  }

  // Meta Information and Notes
  if (reviewData.meta?.notes) {
    doc.addPage();
    currentY = margin;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Additional Notes & Recommendations", margin, currentY);
    currentY += 20;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    currentY = addWrappedText(
      reviewData.meta.notes,
      margin,
      currentY,
      contentWidth,
      10
    );
  }

  // Footer on last page
  const totalPages = doc.internal.pages.length - 1; // Subtract 1 because pages array includes a null first element
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Review Report - ${reviewData.cvId.fullName} | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  return doc;
};

export const downloadReviewPDF = (reviewData: ReviewData) => {
  try {
    const pdf = generateReviewPDF(reviewData);
    const fileName = `CV_Review_${reviewData.cvId.fullName.replace(
      /\s+/g,
      "_"
    )}_${reviewData._id.slice(-8).toUpperCase()}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
};
