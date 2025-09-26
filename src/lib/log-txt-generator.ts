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
  // Updated field names to match new form structure
  researchExperience: string;
  teachingExperience: string;
  teamworkAndCommunication: string;
  leadershipAndManagement: string;
  publicationsAndPresentations: string;
  qualityImprovementAndAudit: string;
  clinicalSkillsAndProcedures: string;
  others: string;
  personalStatement: string;
  supportingStatement?: string;
  serviceLevel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  id: string;
}

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
  return roleMap[role] || role || "";
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

// Convert CV data to formatted text
export const convertCVToTxt = (
  cvData: CVData,
  counter: number = 1
): { content: string; filename: string } => {
  const lines: string[] = [];

  // Helper function to check if a value is provided (not empty, null, or undefined)
  const isProvided = (
    value: string | number | string[] | null | undefined
  ): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "number") return !isNaN(value) && value > 0;
    return false;
  };

  // First two lines: Service level and Last name
  lines.push(`Service level = ${cvData.serviceLevel}`);
  lines.push(`Last name = ${cvData.lastName}`);
  lines.push(""); // Empty line for spacing

  // Personal Details Section
  lines.push("=".repeat(50));
  lines.push("USER INFO");
  lines.push("=".repeat(50));
  lines.push("");

  // Only add fields if they are provided
  if (isProvided(cvData.firstName)) {
    lines.push(`First Name: ${cvData.firstName}`);
  }

  if (isProvided(cvData.lastName)) {
    lines.push(`Last Name: ${cvData.lastName}`);
  }

  // Full name - only if different from first + last name combination
  const calculatedFullName = `${cvData.firstName || ""} ${
    cvData.lastName || ""
  }`.trim();
  const providedFullName = cvData.fullName?.trim();
  if (isProvided(providedFullName) && providedFullName !== calculatedFullName) {
    lines.push(`Full Name: ${providedFullName}`);
  } else if (calculatedFullName && !providedFullName) {
    lines.push(`Full Name: ${calculatedFullName}`);
  }

  // Email - only if provided
  const email = cvData.userId?.email || cvData.email;
  if (isProvided(email)) {
    lines.push(`Email: ${email}`);
  }

  // Year of Birth - only if provided and valid
  if (isProvided(cvData.yearOfBirth)) {
    lines.push(`Year of Birth: ${cvData.yearOfBirth}`);
  }

  // Year of Medical Graduation - only if provided and valid
  if (isProvided(cvData.yearOfMedicalGraduation)) {
    lines.push(`Year of Medical Graduation: ${cvData.yearOfMedicalGraduation}`);
  }

  // Applying for Job Role - only if provided
  if (isProvided(cvData.applyingForJobRole)) {
    lines.push(
      `Applying for Job Role: ${getJobRoleDisplay(cvData.applyingForJobRole)}`
    );
  }

  // Target Markets - only if provided
  if (isProvided(cvData.targetMarkets)) {
    lines.push(
      `Target Markets: ${getTargetMarketsDisplay(cvData.targetMarkets)}`
    );
  }

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
  if (cvData.leadershipAndManagement && cvData.leadershipAndManagement.trim()) {
    lines.push(cvData.leadershipAndManagement);
  }
  lines.push("");

  // QIP and Audit Experience Section
  lines.push("=".repeat(50));
  lines.push("QIP AND AUDIT EXPERIENCE");
  lines.push("=".repeat(50));
  lines.push("");
  if (
    cvData.qualityImprovementAndAudit &&
    cvData.qualityImprovementAndAudit.trim()
  ) {
    lines.push(cvData.qualityImprovementAndAudit);
  }
  lines.push("");

  // Clinical Skills and Procedure Competency Section
  lines.push("=".repeat(50));
  lines.push("CLINICAL SKILLS AND PROCEDURE COMPETENCY");
  lines.push("=".repeat(50));
  lines.push("");
  if (
    cvData.clinicalSkillsAndProcedures &&
    cvData.clinicalSkillsAndProcedures.trim()
  ) {
    lines.push(cvData.clinicalSkillsAndProcedures);
  }
  lines.push("");

  // Teamwork and Communication Section
  lines.push("=".repeat(50));
  lines.push("TEAMWORK AND COMMUNICATION");
  lines.push("=".repeat(50));
  lines.push("");
  if (
    cvData.teamworkAndCommunication &&
    cvData.teamworkAndCommunication.trim()
  ) {
    lines.push(cvData.teamworkAndCommunication);
  }
  lines.push("");

  // Publications and Presentations Section
  lines.push("=".repeat(50));
  lines.push("PUBLICATIONS AND PRESENTATIONS");
  lines.push("=".repeat(50));
  lines.push("");
  if (
    cvData.publicationsAndPresentations &&
    cvData.publicationsAndPresentations.trim()
  ) {
    lines.push(cvData.publicationsAndPresentations);
  }
  lines.push("");

  // Others Section
  lines.push("=".repeat(50));
  lines.push("OTHERS");
  lines.push("=".repeat(50));
  lines.push("");
  if (cvData.others && cvData.others.trim()) {
    lines.push(cvData.others);
  }
  lines.push("");

  // Personal Statement Section
  lines.push("=".repeat(50));
  lines.push("PERSONAL STATEMENT");
  lines.push("=".repeat(50));
  lines.push("");
  if (cvData.personalStatement && cvData.personalStatement.trim()) {
    lines.push(cvData.personalStatement);
  }
  lines.push("");

  // Supporting Statement Section
  lines.push("=".repeat(50));
  lines.push("SUPPORTING STATEMENT");
  lines.push("=".repeat(50));
  lines.push("");
  if (cvData.supportingStatement && cvData.supportingStatement.trim()) {
    lines.push(cvData.supportingStatement);
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
  const filename = `LOG_${cvData._id}.txt`;

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
