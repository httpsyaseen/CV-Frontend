interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PreviousExperience {
  startDate: string;
  endDate: string;
  hospitalName: string;
  hospitalAddress: string;
  jobTitle: string;
  jobDescription: string;
  _id?: string;
}

interface CVData {
  _id: string;
  userId?: User;
  firstName: string;
  lastName: string;
  email?: string;
  yearOfBirth: number;
  yearOfMedicalGraduation: number;
  applyingForJobRole: string;
  targetMarkets: string[];
  previousExperiences?: PreviousExperience[];
  researchExperience: string;
  teachingExperience: string;
  leadershipManagementExperience: string;
  auditQualityImprovementExperience: string;
  clinicalSkillsProcedureCompetency: string;
  personalStatement: string;
  serviceLevel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  id: string;
}

// Generate a random 3-character alphabetical string
const generateRandomString = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format date to readable format
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
};

// Get job role display name
const getJobRoleDisplay = (role: string): string => {
  const roleMap: Record<string, string> = {
    tier1: "Tier 1 (SHO, CT/ST1–2, FY2, JCF, CF, etc.)",
    middleGrade: "Middle Grade (Registrar, SpR, SCF, CF, etc.)",
    consultant: "Consultant",
  };
  return roleMap[role] || role;
};

// Get target markets display
const getTargetMarketsDisplay = (markets: string[]): string => {
  const marketMap: Record<string, string> = {
    uk: "UK",
    republicOfIreland: "Ireland",
    europe: "Europe",
    america: "America",
    gcc: "GCC",
    others: "Others",
  };
  return markets.map((market) => marketMap[market] || market).join(", ");
};

// Generate filename with collision handling
const generateFilename = (lastName: string, counter: number = 1): string => {
  const randomString = generateRandomString();
  const baseFilename = `${lastName}_${randomString}_${counter}.txt`;

  // If we need to handle filename collisions, we can add GMT time
  // For now, return the base filename as collision handling would require
  // checking existing files which is typically done on the server side
  return baseFilename;
};

// Convert CV data to formatted text
export const convertCVToTxt = (
  cvData: CVData,
  counter: number = 1
): { content: string; filename: string } => {
  const lines: string[] = [];

  // First two lines: Service level and Last name
  lines.push(`Service level = ${cvData.serviceLevel}`);
  lines.push(`Last name = ${cvData.lastName}`);
  lines.push(""); // Empty line for spacing

  // Personal Details Section
  lines.push("=".repeat(50));
  lines.push("PERSONAL DETAILS");
  lines.push("=".repeat(50));
  lines.push("");
  lines.push(`First Name: ${cvData.firstName}`);
  lines.push(`Last Name: ${cvData.lastName}`);
  lines.push(
    `Full Name: ${cvData.fullName || `${cvData.firstName} ${cvData.lastName}`}`
  );

  // Email from userId or direct field
  const email = cvData.userId?.email || cvData.email || "N/A";
  lines.push(`Email: ${email}`);

  lines.push(`Year of Birth: ${cvData.yearOfBirth}`);
  lines.push(`Year of Medical Graduation: ${cvData.yearOfMedicalGraduation}`);
  lines.push(
    `Applying for Job Role: ${getJobRoleDisplay(cvData.applyingForJobRole)}`
  );
  lines.push(
    `Target Markets: ${getTargetMarketsDisplay(cvData.targetMarkets)}`
  );
  lines.push("");

  // Previous Experience Section(s)
  if (cvData.previousExperiences && cvData.previousExperiences.length > 0) {
    cvData.previousExperiences.forEach((experience, index) => {
      lines.push("=".repeat(50));
      lines.push(`PREVIOUS EXPERIENCE ${index + 1}`);
      lines.push("=".repeat(50));
      lines.push("");
      lines.push(`Start Date: ${formatDate(experience.startDate)}`);
      lines.push(`End Date: ${formatDate(experience.endDate)}`);
      lines.push(`Hospital Name: ${experience.hospitalName}`);
      lines.push(`Hospital Address: ${experience.hospitalAddress}`);
      lines.push(`Job Title: ${experience.jobTitle}`);
      lines.push("");
      lines.push("Job Description:");
      lines.push(experience.jobDescription);
      lines.push("");
    });
  } else {
    lines.push("=".repeat(50));
    lines.push("PREVIOUS EXPERIENCE");
    lines.push("=".repeat(50));
    lines.push("");
  }

  // Teaching Experience Section
  lines.push("=".repeat(50));
  lines.push("TEACHING EXPERIENCE");
  lines.push("=".repeat(50));
  lines.push("");
  if (cvData.teachingExperience && cvData.teachingExperience.trim()) {
    lines.push(cvData.teachingExperience);
  }
  lines.push("");

  // Research and Publication Experience Section
  lines.push("=".repeat(50));
  lines.push("RESEARCH AND PUBLICATION EXPERIENCE");
  lines.push("=".repeat(50));
  lines.push("");
  if (cvData.researchExperience && cvData.researchExperience.trim()) {
    lines.push(cvData.researchExperience);
  }
  lines.push("");

  // Leadership and Management Experience Section
  lines.push("=".repeat(50));
  lines.push("LEADERSHIP AND MANAGEMENT EXPERIENCE");
  lines.push("=".repeat(50));
  lines.push("");
  if (
    cvData.leadershipManagementExperience &&
    cvData.leadershipManagementExperience.trim()
  ) {
    lines.push(cvData.leadershipManagementExperience);
  }
  lines.push("");

  // QIP and Audit Experience Section
  lines.push("=".repeat(50));
  lines.push("QIP AND AUDIT EXPERIENCE");
  lines.push("=".repeat(50));
  lines.push("");
  if (
    cvData.auditQualityImprovementExperience &&
    cvData.auditQualityImprovementExperience.trim()
  ) {
    lines.push(cvData.auditQualityImprovementExperience);
  }
  lines.push("");

  // Clinical Skills and Procedure Competency Section
  lines.push("=".repeat(50));
  lines.push("CLINICAL SKILLS AND PROCEDURE COMPETENCY");
  lines.push("=".repeat(50));
  lines.push("");
  if (
    cvData.clinicalSkillsProcedureCompetency &&
    cvData.clinicalSkillsProcedureCompetency.trim()
  ) {
    lines.push(cvData.clinicalSkillsProcedureCompetency);
  }
  lines.push("");

  // Personal Statement Section
  lines.push("=".repeat(50));
  lines.push("PERSONAL STATEMENT OR SUPPORTING DETAILS");
  lines.push("=".repeat(50));
  lines.push("");
  if (cvData.personalStatement && cvData.personalStatement.trim()) {
    lines.push(cvData.personalStatement);
  }
  lines.push("");

  // Footer with metadata
  lines.push("=".repeat(50));
  lines.push("SUBMISSION DETAILS");
  lines.push("=".repeat(50));
  lines.push("");
  lines.push(`CV ID: ${cvData._id}`);
  lines.push(`Submission Date: ${formatDate(cvData.createdAt)}`);
  lines.push(`Status: ${cvData.status}`);
  lines.push(
    `Generated: ${new Date().toLocaleString("en-GB", { timeZone: "GMT" })} GMT`
  );

  const content = lines.join("\n");
  const filename = generateFilename(cvData.lastName, counter);

  return {
    content,
    filename,
  };
};

// Function to trigger download of the generated TXT file
export const downloadCVAsLOGTxt = (
  cvData: CVData,
  counter: number = 1
): void => {
  const { content, filename } = convertCVToTxt(cvData, counter);

  // Create blob with UTF-8 encoding
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
