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

export const generateEnhancedReviewPDF = (reviewData: ReviewData): jsPDF => {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Professional Color Scheme
  const colors = {
    primary: [34, 139, 34], // Forest Green
    secondary: [70, 130, 180], // Steel Blue
    accent: [255, 140, 0], // Dark Orange
    success: [46, 204, 113], // Emerald Green
    warning: [241, 196, 15], // Sun Flower
    danger: [231, 76, 60], // Alizarin Red
    text: [44, 62, 80], // Midnight Blue
    lightText: [127, 140, 141], // Gray
    lightGray: [236, 240, 241], // Clouds
    mediumGray: [189, 195, 199], // Silver
    white: [255, 255, 255],
    background: [248, 249, 250], // Light background
  };

  // Helper function to set RGB color
  const setColor = (
    colorArray: number[],
    type: "text" | "fill" | "draw" = "text"
  ) => {
    const [r, g, b] = colorArray;
    if (type === "text") {
      doc.setTextColor(r, g, b);
    } else if (type === "fill") {
      doc.setFillColor(r, g, b);
    } else {
      doc.setDrawColor(r, g, b);
    }
  };

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number = 20) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin + 10; // Add some top margin on new pages
      return true;
    }
    return false;
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

  // Enhanced text rendering with better spacing
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10,
    lineSpacing: number = 1.5
  ): number => {
    const lines = wrapText(text, maxWidth, fontSize);
    doc.setFontSize(fontSize);
    const lineHeight = fontSize * 0.35 * lineSpacing;

    lines.forEach((line: string, index: number) => {
      doc.text(line, x, y + index * lineHeight);
    });

    return y + lines.length * lineHeight;
  };

  // Professional section header with gradient-like effect
  const addSectionHeader = (
    title: string,
    y: number,
    color: number[] = colors.primary
  ): number => {
    const headerHeight = 12;
    checkPageBreak(headerHeight + 10);

    // Main background
    setColor(color, "fill");
    doc.rect(margin, y - 8, contentWidth, headerHeight, "F");

    // Subtle border
    setColor(colors.mediumGray, "draw");
    doc.setLineWidth(0.5);
    doc.rect(margin, y - 8, contentWidth, headerHeight);

    // Header text
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    setColor(colors.white, "text");
    doc.text(title, margin + 8, y + 2);

    // Reset line width
    doc.setLineWidth(0.2);

    return y + headerHeight + 8;
  };

  // Function to get score label
  const getScoreLabel = (score: number, maxScore: number): string => {
    const percentage = score / maxScore;
    if (percentage >= 0.9) return "Excellent";
    else if (percentage >= 0.8) return "Very Good";
    else if (percentage >= 0.7) return "Good";
    else if (percentage >= 0.6) return "Satisfactory";
    else if (percentage >= 0.4) return "Needs Improvement";
    else return "Poor";
  };

  // Enhanced score badge with better styling
  const addScoreBadge = (
    score: number,
    maxScore: number,
    x: number,
    y: number,
    size: number = 20
  ): void => {
    const badgeWidth = size;
    const badgeHeight = size * 0.4;

    // Determine color based on score percentage
    const percentage = score / maxScore;
    let badgeColor = colors.danger;
    if (percentage >= 0.8) badgeColor = colors.success;
    else if (percentage >= 0.6) badgeColor = colors.warning;
    else if (percentage >= 0.4) badgeColor = colors.accent;

    // Badge shadow
    setColor([0, 0, 0, 0.1], "fill");
    doc.roundedRect(x + 1, y - 5, badgeWidth, badgeHeight, 3, 3, "F");

    // Badge background
    setColor(badgeColor, "fill");
    doc.roundedRect(x, y - 6, badgeWidth, badgeHeight, 3, 3, "F");

    // Badge border
    setColor(colors.white, "draw");
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y - 6, badgeWidth, badgeHeight, 3, 3, "S");
    doc.setLineWidth(0.2);

    // Badge text
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    setColor(colors.white, "text");
    doc.text(`${score}/${maxScore}`, x + badgeWidth / 2, y - 2, {
      align: "center",
    });
  };

  // Enhanced bullet points with better styling
  const addBulletPoint = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    bulletColor: number[] = colors.primary,
    indent: number = 0
  ): number => {
    const bulletX = x + indent;
    const textX = bulletX + 8;

    // Add styled bullet
    setColor(bulletColor, "fill");
    doc.circle(bulletX + 2, y - 2, 1.5, "F");

    // Add bullet shadow
    setColor([0, 0, 0, 0.2], "fill");
    doc.circle(bulletX + 2.5, y - 1.5, 1.5, "F");

    // Add text with proper spacing
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    setColor(colors.text, "text");
    return addWrappedText(text, textX, y, maxWidth - (textX - x), 10, 1.4);
  };

  // Add status indicator
  const addStatusIndicator = (status: string, x: number, y: number): void => {
    let statusColor = colors.mediumGray;
    const statusText = status.toUpperCase();

    switch (status.toLowerCase()) {
      case "ok":
      case "good":
        statusColor = colors.success;
        break;
      case "missing":
      case "needs work":
        statusColor = colors.danger;
        break;
      case "warning":
        statusColor = colors.warning;
        break;
    }

    // Status badge
    setColor(statusColor, "fill");
    doc.roundedRect(x, y - 6, 25, 8, 2, 2, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    setColor(colors.white, "text");
    doc.text(statusText, x + 12.5, y - 1, { align: "center" });
  };

  // Create elegant page header
  const addPageHeader = (pageNum: number, totalPages: number) => {
    // Header line
    setColor(colors.primary, "draw");
    doc.setLineWidth(2);
    doc.line(margin, 15, pageWidth - margin, 15);

    // Page info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setColor(colors.lightText, "text");
    doc.text(
      `CV Review Report - ${reviewData.cvId.fullName} | Page ${pageNum} of ${totalPages}`,
      pageWidth / 2,
      10,
      { align: "center" }
    );
  };

  // Start with cover page
  currentY = margin + 30;

  // Cover page design
  // Header background
  setColor(colors.primary, "fill");
  doc.rect(0, 0, pageWidth, 60, "F");

  // Decorative elements
  setColor(colors.secondary, "fill");
  doc.circle(pageWidth - 30, 30, 20, "F");
  setColor(colors.accent, "fill");
  doc.circle(30, 40, 15, "F");

  // Main title
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  setColor(colors.white, "text");
  doc.text("CV REVIEW REPORT", pageWidth / 2, 40, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Professional Analysis & Recommendations", pageWidth / 2, 50, {
    align: "center",
  });

  // Reset text color
  setColor(colors.text, "text");
  currentY = 80;

  // Candidate information card
  setColor(colors.lightGray, "fill");
  doc.roundedRect(margin, currentY, contentWidth, 50, 5, 5, "F");
  setColor(colors.mediumGray, "draw");
  doc.setLineWidth(1);
  doc.roundedRect(margin, currentY, contentWidth, 50, 5, 5, "S");

  currentY += 15;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  setColor(colors.primary, "text");
  doc.text(`${reviewData.cvId.fullName}`, margin + 10, currentY);

  currentY += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  setColor(colors.text, "text");

  // Job role mapping
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

  doc.text(`Applying for: ${jobRole}`, margin + 10, currentY);
  currentY += 6;
  doc.text(`Target Markets: ${targetMarkets}`, margin + 10, currentY);
  currentY += 6;
  doc.text(
    `Service Level: ${
      reviewData.review_type.charAt(0).toUpperCase() +
      reviewData.review_type.slice(1)
    }`,
    margin + 10,
    currentY
  );
  currentY += 6;
  doc.text(
    `Review Date: ${new Date(reviewData.completed_at).toLocaleDateString(
      "en-GB",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    )}`,
    margin + 10,
    currentY
  );

  // Summary statistics
  currentY += 25;
  setColor(colors.secondary, "fill");
  doc.roundedRect(margin, currentY, contentWidth / 2 - 5, 35, 3, 3, "F");
  setColor(colors.accent, "fill");
  doc.roundedRect(
    margin + contentWidth / 2 + 5,
    currentY,
    contentWidth / 2 - 5,
    35,
    3,
    3,
    "F"
  );

  // Overall readiness
  currentY += 12;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  setColor(colors.white, "text");
  doc.text("OVERALL READINESS", margin + contentWidth / 4, currentY, {
    align: "center",
  });
  currentY += 8;
  doc.setFontSize(16);
  doc.text(
    reviewData.global_summary.overall_readiness.toUpperCase(),
    margin + contentWidth / 4,
    currentY,
    { align: "center" }
  );

  // Total score
  currentY -= 8;
  doc.text(
    "TOTAL SCORE",
    margin + contentWidth / 2 + 5 + contentWidth / 4,
    currentY,
    { align: "center" }
  );
  currentY += 8;
  const maxPossibleScore = reviewData.sections.length * 4;
  doc.text(
    `${reviewData.global_summary.total_score}/${maxPossibleScore}`,
    margin + contentWidth / 2 + 5 + contentWidth / 4,
    currentY,
    { align: "center" }
  );

  // Add new page for content
  doc.addPage();
  currentY = margin + 10;

  // Executive Summary
  currentY = addSectionHeader("EXECUTIVE SUMMARY", currentY, colors.primary);

  setColor(colors.text, "text");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Overall Assessment:", margin, currentY);
  currentY += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const readinessColor =
    reviewData.global_summary.overall_readiness.toLowerCase() === "ready"
      ? colors.success
      : colors.warning;
  setColor(readinessColor, "text");
  doc.text(
    `Status: ${reviewData.global_summary.overall_readiness}`,
    margin + 5,
    currentY
  );
  setColor(colors.text, "text");
  currentY += 6;
  doc.text(
    `Total Score: ${
      reviewData.global_summary.total_score
    }/${maxPossibleScore} (${Math.round(
      (reviewData.global_summary.total_score / maxPossibleScore) * 100
    )}%)`,
    margin + 5,
    currentY
  );
  currentY += 15;

  // Top Priority Fixes with enhanced styling
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PRIORITY ACTION ITEMS:", margin, currentY);
  currentY += 10;

  reviewData.global_summary.top_fixes.forEach((fix, index) => {
    checkPageBreak(20);
    const priorityColor =
      index < 2 ? colors.danger : index < 4 ? colors.warning : colors.accent;
    currentY = addBulletPoint(
      fix,
      margin,
      currentY,
      contentWidth,
      priorityColor
    );
    currentY += 4;
  });

  currentY += 10;

  // Section Scores Overview with visual chart
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  setColor(colors.text, "text");
  doc.text("SECTION PERFORMANCE OVERVIEW:", margin, currentY);
  currentY += 15;

  reviewData.global_summary.scoring_breakdown.forEach((item) => {
    checkPageBreak(12);

    // Create bullet point format for each section score
    const scoreLabel = getScoreLabel(item.score, 4);
    const scoreText = `${item.section_name} - ${scoreLabel} (${item.score}/4)`;

    // Determine color based on score
    const percentage = item.score / 4;
    let scoreColor = colors.danger;
    if (percentage >= 0.8) scoreColor = colors.success;
    else if (percentage >= 0.6) scoreColor = colors.warning;
    else if (percentage >= 0.4) scoreColor = colors.accent;

    currentY = addBulletPoint(
      scoreText,
      margin,
      currentY,
      contentWidth,
      scoreColor
    );
    currentY += 4;
  });

  currentY += 15;

  // Detailed Section Analysis
  doc.addPage();
  currentY = margin + 10;

  currentY = addSectionHeader(
    "DETAILED SECTION ANALYSIS",
    currentY,
    colors.secondary
  );

  reviewData.sections.forEach((section, sectionIndex) => {
    checkPageBreak(40);

    // Section header with number and status
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    setColor(colors.primary, "text");
    doc.text(`${sectionIndex + 1}. ${section.section_name}`, margin, currentY);

    // Add status indicator and score
    addStatusIndicator(
      section.section_status,
      pageWidth - margin - 60,
      currentY + 2
    );
    addScoreBadge(
      section.section_score,
      4,
      pageWidth - margin - 30,
      currentY + 2
    );

    currentY += 12;

    // Justification box
    if (section.justification) {
      setColor(colors.background, "fill");
      const justificationHeight = Math.max(
        15,
        wrapText(section.justification, contentWidth - 20, 10).length * 4
      );
      doc.roundedRect(
        margin,
        currentY - 5,
        contentWidth,
        justificationHeight,
        3,
        3,
        "F"
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      setColor(colors.lightText, "text");
      currentY = addWrappedText(
        `"${section.justification}"`,
        margin + 8,
        currentY,
        contentWidth - 16,
        10
      );
      currentY += 10;
    }

    setColor(colors.text, "text");

    // Strengths section
    if (section.strengths.length > 0) {
      checkPageBreak(25);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      setColor(colors.success, "text");
      doc.text("STRENGTHS", margin, currentY);
      currentY += 8;

      setColor(colors.text, "text");
      doc.setFont("helvetica", "normal");
      section.strengths.forEach((strength) => {
        checkPageBreak(15);
        currentY = addBulletPoint(
          strength,
          margin,
          currentY,
          contentWidth,
          colors.success
        );
        currentY += 3;
      });
      currentY += 8;
    }

    // Weaknesses section
    if (section.weaknesses.length > 0) {
      checkPageBreak(25);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      setColor(colors.danger, "text");
      doc.text("AREAS FOR IMPROVEMENT", margin, currentY);
      currentY += 8;

      setColor(colors.text, "text");
      doc.setFont("helvetica", "normal");
      section.weaknesses.forEach((weakness) => {
        checkPageBreak(15);
        currentY = addBulletPoint(
          weakness,
          margin,
          currentY,
          contentWidth,
          colors.danger
        );
        currentY += 3;
      });
      currentY += 8;
    }

    // Actionable Edits section
    if (section.actionable_edits.length > 0) {
      checkPageBreak(25);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      setColor(colors.accent, "text");
      doc.text("ACTIONABLE RECOMMENDATIONS", margin, currentY);
      currentY += 8;

      setColor(colors.text, "text");
      doc.setFont("helvetica", "normal");
      section.actionable_edits.forEach((edit) => {
        checkPageBreak(15);
        currentY = addBulletPoint(
          edit,
          margin,
          currentY,
          contentWidth,
          colors.accent
        );
        currentY += 3;
      });
      currentY += 8;
    }

    // Examples section with enhanced styling
    if (section.examples_bad_to_better.length > 0) {
      checkPageBreak(35);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      setColor(colors.secondary, "text");
      doc.text("BEFORE & AFTER EXAMPLES", margin, currentY);
      currentY += 10;

      section.examples_bad_to_better.forEach((example, exampleIndex) => {
        checkPageBreak(45);

        // Calculate accurate height for the background
        const beforeLines = wrapText(example.bad, contentWidth - 24, 9);
        const afterLines = wrapText(example.better, contentWidth - 24, 9);
        const whyLines = wrapText(example.why_better, contentWidth - 24, 9);

        const exampleHeight =
          15 + // Title space
          5 +
          beforeLines.length * 4 +
          5 + // Before section
          5 +
          afterLines.length * 4 +
          5 + // After section
          5 +
          whyLines.length * 4 +
          12; // Why better section + bottom padding

        // Draw background container
        setColor(colors.lightGray, "fill");
        doc.roundedRect(
          margin,
          currentY - 5,
          contentWidth,
          exampleHeight,
          3,
          3,
          "F"
        );

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        setColor(colors.secondary, "text");
        doc.text(`Example ${exampleIndex + 1}:`, margin + 8, currentY + 2);
        currentY += 10;

        // Before section
        setColor(colors.danger, "text");
        doc.setFont("helvetica", "bold");
        doc.text("BEFORE:", margin + 8, currentY);
        currentY += 5;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        setColor(colors.text, "text");
        currentY = addWrappedText(
          example.bad,
          margin + 12,
          currentY,
          contentWidth - 24,
          9
        );
        currentY += 5;

        // After section
        doc.setFontSize(10);
        setColor(colors.success, "text");
        doc.setFont("helvetica", "bold");
        doc.text("AFTER:", margin + 8, currentY);
        currentY += 5;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        setColor(colors.text, "text");
        currentY = addWrappedText(
          example.better,
          margin + 12,
          currentY,
          contentWidth - 24,
          9
        );
        currentY += 5;

        // Why better section
        doc.setFontSize(10);
        setColor(colors.secondary, "text");
        doc.setFont("helvetica", "bold");
        doc.text("WHY BETTER:", margin + 8, currentY);
        currentY += 5;

        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        setColor(colors.lightText, "text");
        currentY = addWrappedText(
          example.why_better,
          margin + 12,
          currentY,
          contentWidth - 24,
          9
        );
        currentY += 12;
      });
    }

    // Missing Content section
    if (
      section.missing_content.length > 0 &&
      section.missing_content[0] !== "Empty section"
    ) {
      checkPageBreak(25);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      setColor(colors.warning, "text");
      doc.text("MISSING ELEMENTS", margin, currentY);
      currentY += 8;

      setColor(colors.text, "text");
      doc.setFont("helvetica", "normal");
      section.missing_content.forEach((missing) => {
        checkPageBreak(12);
        currentY = addBulletPoint(
          missing,
          margin,
          currentY,
          contentWidth,
          colors.warning
        );
        currentY += 3;
      });
    }

    currentY += 15;

    // Add separator line between sections
    if (sectionIndex < reviewData.sections.length - 1) {
      setColor(colors.lightGray, "draw");
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;
    }
  });

  // Questions for User section
  if (reviewData.global_summary.questions_for_user.length > 0) {
    doc.addPage();
    currentY = margin + 10;

    currentY = addSectionHeader(
      "CLARIFICATION QUESTIONS",
      currentY,
      colors.accent
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    setColor(colors.text, "text");
    currentY = addWrappedText(
      "To provide more targeted recommendations, please provide the following information:",
      margin,
      currentY,
      contentWidth,
      11
    );
    currentY += 15;

    reviewData.global_summary.questions_for_user.forEach((question, index) => {
      checkPageBreak(18);

      // Question number badge
      setColor(colors.accent, "fill");
      doc.circle(margin + 5, currentY - 2, 3, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setColor(colors.white, "text");
      doc.text(`${index + 1}`, margin + 5, currentY, { align: "center" });

      // Question text
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      setColor(colors.text, "text");
      currentY = addWrappedText(
        question,
        margin + 12,
        currentY,
        contentWidth - 12,
        10
      );
      currentY += 8;
    });
  }

  // Rewritten CV Sections
  if (reviewData.rewritten_cv?.sections?.length > 0) {
    doc.addPage();
    currentY = margin + 10;

    currentY = addSectionHeader(
      "REWRITTEN CV SECTIONS",
      currentY,
      colors.success
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    setColor(colors.text, "text");
    currentY = addWrappedText(
      "Below are improved versions of your CV sections incorporating our recommendations:",
      margin,
      currentY,
      contentWidth,
      11
    );
    currentY += 15;

    reviewData.rewritten_cv.sections.forEach((section) => {
      checkPageBreak(30);

      // Section name with accent background
      setColor(colors.success, "fill");
      doc.roundedRect(margin, currentY - 6, contentWidth, 10, 2, 2, "F");

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      setColor(colors.white, "text");
      doc.text(section.section_name, margin + 6, currentY);
      currentY += 12;

      // Content with background
      setColor(colors.background, "fill");
      const contentHeight = Math.max(
        20,
        wrapText(section.content, contentWidth - 16, 10).length * 4
      );
      doc.roundedRect(
        margin,
        currentY - 4,
        contentWidth,
        contentHeight,
        2,
        2,
        "F"
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      setColor(colors.text, "text");
      currentY = addWrappedText(
        section.content,
        margin + 8,
        currentY,
        contentWidth - 16,
        10
      );
      currentY += 15;
    });
  }

  // Meta Information and Strategic Notes
  if (reviewData.meta?.notes) {
    doc.addPage();
    currentY = margin + 10;

    currentY = addSectionHeader(
      "STRATEGIC RECOMMENDATIONS",
      currentY,
      colors.secondary
    );

    setColor(colors.background, "fill");
    const notesHeight = Math.max(
      30,
      wrapText(reviewData.meta.notes, contentWidth - 16, 11).length * 4.5
    );
    doc.roundedRect(margin, currentY - 4, contentWidth, notesHeight, 3, 3, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    setColor(colors.text, "text");
    currentY = addWrappedText(
      reviewData.meta.notes,
      margin + 8,
      currentY,
      contentWidth - 16,
      11
    );
  }

  // Add page headers and numbers to all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 2; i <= totalPages; i++) {
    // Skip cover page
    doc.setPage(i);
    addPageHeader(i - 1, totalPages - 1);
  }

  // Footer with branding on last page
  doc.setPage(totalPages);
  currentY = pageHeight - 30;

  setColor(colors.primary, "draw");
  doc.setLineWidth(1);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  setColor(colors.lightText, "text");
  doc.text(
    "Generated by Professional CV Review System",
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  currentY += 4;
  doc.text(
    `Report ID: ${reviewData._id
      .slice(-8)
      .toUpperCase()} | Generated: ${new Date().toLocaleDateString("en-GB")}`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  return doc;
};

export const downloadEnhancedReviewPDF = (reviewData: ReviewData) => {
  try {
    const pdf = generateEnhancedReviewPDF(reviewData);
    const fileName = `Enhanced_CV_Review_${reviewData.cvId.fullName.replace(
      /\s+/g,
      "_"
    )}_${reviewData._id.slice(-8).toUpperCase()}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating enhanced PDF:", error);
    throw new Error("Failed to generate enhanced PDF. Please try again.");
  }
};
