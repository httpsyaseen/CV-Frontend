"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { downloadCVAsTxt } from "@/lib/cv-txt-generator";
import { downloadCVAsLOGTxt } from "@/lib/log-txt-generator";
import toast from "react-hot-toast";

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
  _id: string;
}

interface CV {
  _id: string;
  userId: User;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  yearOfMedicalGraduation: number;
  applyingForJobRole: string;
  targetMarkets: string[];
  previousExperiences: PreviousExperience[];
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
  reviewId?: string;
  reviewedAt?: string;
  __v: number;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    cvs: CV[];
  };
}

export default function TotalCVsPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCVs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/reviewed-cvs");
        const data: ApiResponse = response.data;

        if (data.status === "success") {
          setCvs(data.data.cvs);
        } else {
          setError("Failed to fetch CVs");
        }
      } catch (err) {
        console.error("Error fetching CVs:", err);
        setError("Failed to fetch CVs");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCVs();
  }, []);

  const getUserFullName = (cv: CV) => {
    return `${cv.userId.firstName} ${cv.userId.lastName}`;
  };

  const getUserEmail = (cv: CV) => {
    return cv.userId.email;
  };

  const handleDownloadCV = (cvId: string) => {
    const cvData = cvs.find((cv) => cv._id === cvId);

    if (!cvData) {
      toast.error("CV data not found. Please refresh the page and try again.");
      return;
    }

    try {
      // Add the missing properties for the download function
      const downloadData = {
        ...cvData,
        fullName: getUserFullName(cvData),
        id: cvData._id,
      };
      downloadCVAsTxt(downloadData, 1);
      toast.success(`Downloaded CV for: ${getUserFullName(cvData)}`);
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast.error("Failed to download CV. Please try again.");
    }
  };

  const handleDownloadLog = (cvId: string) => {
    const cvData = cvs.find((cv) => cv._id === cvId);

    if (!cvData) {
      toast.error("CV data not found. Please refresh the page and try again.");
      return;
    }

    try {
      // Add the missing properties for the download function
      const downloadData = {
        ...cvData,
        fullName: getUserFullName(cvData),
        id: cvData._id,
      };
      downloadCVAsLOGTxt(downloadData, 1);
      toast.success(`Downloaded LOG for: ${getUserFullName(cvData)}`);
    } catch (error) {
      console.error("Error downloading LOG:", error);
      toast.error("Failed to download LOG. Please try again.");
    }
  };

  const handleViewReport = (reviewId: string) => {
    router.push(`/review/${reviewId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        className:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800",
        label: "Pending",
      },
      reviewed: {
        className:
          "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800",
        label: "Reviewed",
      },
      rejected: {
        className:
          "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800",
        label: "Rejected",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-white mx-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin - All CVs
              </h1>
              <p className="text-gray-600">
                View and manage all CV submissions
              </p>
            </div>
            <Link href="/admin-dashboard">
              <Button
                variant="outline"
                className="bg-green-600 text-white hover:bg-green-600 hover:text-white hover:border-green-600"
              >
                Back to Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-white shadow-lg border-green-700">
          <CardHeader>
            <CardTitle>All CV Submissions - Admin Panel</CardTitle>
            <CardDescription>
              Complete list of all CV submissions with download options
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading CVs...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 hover:bg-transparent hover:border-gray-300"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : cvs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No CV submissions found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Service Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Download CV</TableHead>
                      <TableHead>Download LOG</TableHead>
                      <TableHead>View Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cvs.map((cv) => (
                      <TableRow key={cv._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {getUserFullName(cv)}
                        </TableCell>
                        <TableCell>{getUserEmail(cv)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              cv.serviceLevel === "premium"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                            }
                          >
                            {cv.serviceLevel.charAt(0).toUpperCase() +
                              cv.serviceLevel.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(cv.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(cv.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadCV(cv._id)}
                            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                          >
                            <Download className="w-4 h-4" />
                            Download CV
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadLog(cv._id)}
                            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                          >
                            <Download className="w-4 h-4" />
                            Download LOG
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReport(cv.reviewId!)}
                            disabled={cv.status !== "reviewed" || !cv.reviewId}
                            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                          >
                            <Eye className="w-4 h-4" />
                            View Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
