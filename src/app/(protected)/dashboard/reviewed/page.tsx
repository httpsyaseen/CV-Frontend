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
import { Loader2, PlusCircle, MoveLeft, Clock10, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface PreviousExperience {
  startDate: string;
  endDate: string;
  hospitalName: string;
  hospitalAddress: string;
  jobTitle: string;
  jobDescription: string;
  _id: string;
}

interface ReviewedCV {
  _id: string;
  userId: string;
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
  __v: number;
  reviewId: string;
  reviewedAt: string;
  id: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    reviewed: ReviewedCV[];
  };
}

export default function ReviewedRequestsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewedCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewedCVs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/review/my-reviews");
        const data: ApiResponse = response.data;

        if (data.status === "success") {
          setReviews(data.data?.reviewed || []);
        } else {
          setError("Failed to fetch reviewed CVs");
        }
      } catch (err) {
        console.error("Error fetching reviewed CVs:", err);
        setError("Failed to fetch reviewed CVs");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewedCVs();
  }, []);

  const handleViewReport = (reviewId: string) => {
    router.push(`/review/${reviewId}`);
  };

  const getJobRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      tier1: "Tier 1 (SHO, CT/ST1–2, FY2, JCF, CF, etc.)",
      middleGrade: "Middle Grade (Registrar, SpR, SCF, CF, etc.)",
      consultant: "Consultant",
    };
    return roleMap[role] || role || "Not Specified";
  };

  const getTargetMarketsDisplay = (markets: string[] | undefined) => {
    if (!markets || !Array.isArray(markets)) return "Not Specified";

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
                Reviewed CVs
              </h1>
              <p className="text-gray-600">
                View and download your completed CV reviews
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-green-600 text-white">
                  <MoveLeft className="w-4 h-4 ml-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/pending">
                <Button variant="outline" className="bg-amber-600 text-white">
                  View Pending Requests
                  <Clock10 className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/new-request">
                <Button variant="outline" className="bg-green-600 text-white">
                  Create New Request
                  <PlusCircle className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Card className="bg-white shadow-lg border-green-700">
          <CardHeader>
            <CardTitle>Your Reviewed CVs</CardTitle>
            <CardDescription>
              Access and download your completed CV review reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading reviewed CVs...</span>
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
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No reviewed CVs found.</p>
                <Link href="/dashboard/new-request">
                  <Button className="mt-4 bg-green-600 hover:bg-green-600 hover:text-white hover:border-green-600">
                    Submit New CV Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Review ID</TableHead>
                      <TableHead>CV ID</TableHead>
                      <TableHead>Person Name</TableHead>
                      <TableHead>Job Role</TableHead>
                      <TableHead>Target Markets</TableHead>
                      <TableHead>Review Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Turnaround Days</TableHead>
                      <TableHead>View Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {review.reviewId.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {review._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {review.firstName} {review.lastName}
                        </TableCell>
                        <TableCell>
                          {getJobRoleDisplay(review.applyingForJobRole)}
                        </TableCell>
                        <TableCell>
                          {review.targetMarkets &&
                          Array.isArray(review.targetMarkets) &&
                          review.targetMarkets.length > 0
                            ? getTargetMarketsDisplay(review.targetMarkets)
                            : "Not Specified"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              review.serviceLevel === "premium"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                            }
                          >
                            {review.serviceLevel.charAt(0).toUpperCase() +
                              review.serviceLevel.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                            {review.status.charAt(0).toUpperCase() +
                              review.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {review.reviewedAt
                            ? new Date(review.reviewedAt).toLocaleDateString()
                            : new Date(review.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {Math.floor(
                              (new Date().getTime() -
                                new Date(review.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            {Math.floor(
                              (new Date().getTime() -
                                new Date(review.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) === 1
                              ? "day"
                              : "days"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(review.reviewId)}
                              className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                            >
                              <Eye className="w-4 h-4" />
                              View Report
                            </Button>
                          </div>
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
