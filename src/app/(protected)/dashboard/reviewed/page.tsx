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
import { Loader2, Download } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { downloadEnhancedReviewPDF } from "@/lib/enhanced-review-pdf-generator";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

interface CV {
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
}

interface Reviewer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SectionScore {
  section_name: string;
  score: number;
}

interface GlobalSummary {
  overall_readiness: string;
  top_fixes: string[];
  questions_for_user: string[];
  scoring_breakdown: SectionScore[];
  total_score: number;
}

interface ExampleBadToBetter {
  bad: string;
  better: string;
  why_better: string;
}

interface ReviewSection {
  section_name: string;
  section_status: string;
  strengths: string[];
  weaknesses: string[];
  actionable_edits: string[];
  examples_bad_to_better: ExampleBadToBetter[];
  missing_content: string[];
  section_score: number;
  justification: string;
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

interface Review {
  _id: string;
  cvId: CV;
  userId: User;
  review_type: string;
  status: string;
  reviewer_id: Reviewer;
  sections: unknown[];
  createdAt: string;
  updatedAt: string;
  completed_at: string;
  __v: number;
  daysSinceCreation: number;
  turnaroundDays: number;
  id: string;
}

interface DetailedReview extends Review {
  sections: ReviewSection[];
  global_summary: GlobalSummary;
  rewritten_cv: RewrittenCV;
  meta: ReviewMeta;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    reviews: Review[];
  };
}

export default function ReviewedRequestsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewedCVs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/review/my-reviews");
        const data: ApiResponse = response.data;

        if (data.status === "success") {
          setReviews(data.data.reviews);
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

  const handleDownloadPDF = async (reviewId: string) => {
    try {
      setDownloadingPDF(reviewId);

      // For now, we'll use the review data from the existing reviews array
      // In a real scenario, you might want to fetch more detailed data
      const review = reviews.find((r) => r._id === reviewId);
      if (!review) {
        throw new Error("Review not found");
      }

      // Convert the review to the format expected by the PDF generator
      const reviewData = review as unknown as DetailedReview;

      // Generate and download enhanced PDF
      downloadEnhancedReviewPDF(reviewData);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPDF(null);
    }
  };

  const getJobRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      tier1: "Tier 1 (SHO, CT/ST1–2, FY2, JCF, CF, etc.)",
      middleGrade: "Middle Grade (Registrar, SpR, SCF, CF, etc.)",
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
                Reviewed CVs
              </h1>
              <p className="text-gray-600">
                View and download your completed CV reviews
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
                      <TableHead>Download PDF</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {review._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {review.cvId._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {review.cvId.fullName}
                        </TableCell>
                        <TableCell>
                          {getJobRoleDisplay(review.cvId.applyingForJobRole)}
                        </TableCell>
                        <TableCell>
                          {getTargetMarketsDisplay(review.cvId.targetMarkets)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              review.cvId.serviceLevel === "premium"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                            }
                          >
                            {review.cvId.serviceLevel.charAt(0).toUpperCase() +
                              review.cvId.serviceLevel.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                            {review.status.charAt(0).toUpperCase() +
                              review.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {review.completed_at
                            ? new Date(review.completed_at).toLocaleDateString()
                            : new Date(review.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {review.turnaroundDays}{" "}
                            {review.turnaroundDays === 1 ? "day" : "days"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPDF(review._id)}
                              disabled={downloadingPDF === review._id}
                              className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                            >
                              {downloadingPDF === review._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                              {downloadingPDF === review._id
                                ? "Generating..."
                                : "Download PDF"}
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
