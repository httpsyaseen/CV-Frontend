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
import { Loader2, Download, Upload } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { downloadCVAsTxt } from "@/lib/cv-txt-generator";
import toast from "react-hot-toast";
import showError from "@/components/send-error";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface CV {
  _id: string;
  userId?: User;
  firstName: string;
  lastName: string;
  email?: string;
  yearOfBirth: number;
  yearOfMedicalGraduation: number;
  applyingForJobRole: string;
  targetMarkets: string[];
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

interface ApiResponse {
  status: string;
  results: number;
  data: {
    cvs: CV[];
  };
}

export default function PendingRequestsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingReview, setUploadingReview] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingCVs = async () => {
      try {
        setLoading(true);
        const response = await api.get("cv/admin/pending");
        const data: ApiResponse = response.data;

        if (data.status === "success") {
          setCvs(data.data.cvs);
        } else {
          setError("Failed to fetch pending CVs");
        }
      } catch (err) {
        console.error("Error fetching pending CVs:", err);
        setError("Failed to fetch pending CVs");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCVs();
  }, []);

  const getEmailFromCV = (cv: CV) => {
    // Email can be in userId.email or directly in email field
    return cv.userId?.email || cv.email || "N/A";
  };

  const handleDownloadFile = (cvId: string) => {
    // Find the CV data from the current list
    const cvData = cvs.find((cv) => cv._id === cvId);

    if (!cvData) {
      alert("CV data not found. Please refresh the page and try again.");
      return;
    }

    try {
      // Generate and download the TXT file
      downloadCVAsTxt(cvData, 1); // Counter starts at 1
      console.log(`Downloaded CV as TXT for: ${cvData.fullName}`);
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Failed to download CV. Please try again.");
    }
  };

  const handleUploadReview = (cvId: string) => {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json,application/json";
    fileInput.style.display = "none";

    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.name.toLowerCase().endsWith(".json")) {
        alert("Please select a JSON file.");
        return;
      }

      try {
        setUploadingReview(cvId);

        // Read file content and validate JSON format
        const fileContent = await file.text();
        let reviewData;

        try {
          reviewData = JSON.parse(fileContent);
        } catch {
          alert("Invalid JSON file. Please check the file format.");
          setUploadingReview(null);
          return;
        }

        // Send JSON data directly instead of FormData
        const response = await api.post(
          `/review/cv/${cvId}`,
          {
            review: reviewData,
            cvId: cvId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Review uploaded successfully:", response.data);

        toast.success("Review uploaded successfully!");
        // Refresh the CV list after successful upload
        const refreshResponse = await api.get("cv/admin/pending");
        const refreshData: ApiResponse = refreshResponse.data;
        if (refreshData.status === "success") {
          setCvs(refreshData.data.cvs);
        }
      } catch (error) {
        console.error("Error uploading review:", error);
        showError(error);
      } finally {
        setUploadingReview(null);
      }
    };

    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  return (
    <div className="min-h-screen bg-white mx-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin - Pending CV Reviews
              </h1>
              <p className="text-gray-600">
                Review and manage pending CV submissions
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
            <CardTitle>Pending CV Reviews - Admin Panel</CardTitle>
            <CardDescription>
              Review and manage all pending CV submissions from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading pending CVs...</span>
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
                <p className="text-gray-600">No pending CV requests found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CV ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Service Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Download File</TableHead>
                      <TableHead>Upload Review</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cvs.map((cv) => (
                      <TableRow key={cv._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {cv._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {cv.userId
                            ? `${cv.userId.firstName} ${cv.userId.lastName}`
                            : `${cv.firstName} ${cv.lastName}`}
                        </TableCell>
                        <TableCell>{getEmailFromCV(cv)}</TableCell>
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
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadFile(cv._id)}
                            className="flex items-center gap-2 bg-green-600 text-white"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUploadReview(cv._id)}
                            disabled={uploadingReview === cv._id}
                            className="flex items-center gap-2 bg-green-600 text-white disabled:hover:border-gray-200"
                          >
                            {uploadingReview === cv._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {uploadingReview === cv._id
                              ? "Uploading..."
                              : "Upload Review"}
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
