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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface CV {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
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

  useEffect(() => {
    const fetchPendingCVs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/cv/user/pending");
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

  const getJobRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      tier1: "Tier 1 (SHO, CT/ST1–2, FY2, JCF, CF, etc.)",
      middle: "Middle Grade (Registrar, SpR, SCF, CF, etc.)",
      consultant: "Consultant",
    };
    return roleMap[role] || role;
  };

  const getTargetMarketsDisplay = (markets: string[]) => {
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
  return (
    <div className="min-h-screen bg-white mx-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pending Requests
              </h1>
              <p className="text-gray-600">
                Track the progress of your submitted CV review requests
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="bg-green-600 text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-white shadow-lg border-green-700">
          <CardHeader>
            <CardTitle>Your Pending CV Reviews</CardTitle>
            <CardDescription>
              Monitor the status of your CV review requests
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
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : cvs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No pending CV requests found.</p>
                <Link href="/dashboard/new-request">
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Submit New CV Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CV ID</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Person Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Job Role</TableHead>
                      <TableHead>Target Markets</TableHead>
                      <TableHead>Service Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cvs.map((cv) => (
                      <TableRow key={cv._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {cv._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {new Date(cv.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {cv.fullName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              cv.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {cv.status.charAt(0).toUpperCase() +
                              cv.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getJobRoleDisplay(cv.applyingForJobRole)}
                        </TableCell>
                        <TableCell>
                          {getTargetMarketsDisplay(cv.targetMarkets)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              cv.serviceLevel === "premium"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {cv.serviceLevel.charAt(0).toUpperCase() +
                              cv.serviceLevel.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-white shadow-lg border-emerald-700">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Review Process Timeline</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>In Queue:</strong> Your request is waiting to be
                    assigned
                  </li>
                  <li>
                    • <strong>Initial Review:</strong> Reviewer is conducting
                    first assessment
                  </li>
                  <li>
                    • <strong>Under Review:</strong> Detailed review and
                    feedback in progress
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">What to Expect</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Standard Review: 24-48 hours completion</li>
                  <li>• Premium Review: 48-72 hours completion</li>
                  <li>• Email notifications at each stage</li>
                  <li>• Detailed feedback and recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
