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

export interface CVData {
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
