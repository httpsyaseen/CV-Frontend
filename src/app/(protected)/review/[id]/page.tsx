"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import showError from "@/components/send-error";

interface CVReviewData {
  _id: string;
  cvId: string;
  userId: string;
  review_type: string;
  sections: Array<{
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
  }>;
  global_summary: {
    overall_readiness: string;
    top_fixes: string[];
    questions_for_user: string[];
    scoring_breakdown: Array<{
      section_name: string;
      score: number;
    }>;
    total_score: number;
  };
  rewritten_cv?: {
    sections: Array<{
      section_name: string;
      content: string;
    }>;
  };
  meta?: {
    version: string;
    notes: string;
    review_date: string;
  };
  status: string;
  reviewer_id: string;
  createdAt: string;
  updatedAt: string;
  completed_at: string;
  __v: number;
}

const getStatusIcon = (status: string, score: number) => {
  if (status === "missing" || score === 0) {
    return <XCircle className="h-5 w-5 text-destructive" />;
  }
  if (score >= 3) {
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  }
  return <AlertCircle className="h-5 w-5 text-yellow-600" />;
};

const getScoreColor = (score: number) => {
  if (score === 0) return "bg-destructive text-destructive-foreground";
  if (score <= 2)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  if (score === 3)
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
};

const getReadinessColor = (readiness: string) => {
  switch (readiness.toLowerCase()) {
    case "ready":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "needs work":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "not ready":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function ReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const reviewId = id;

  const [reviewData, setReviewData] = useState<CVReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    if (!reviewId) {
      setError("Review ID is required");
      setLoading(false);
      return;
    }

    const fetchReviewData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/review/${reviewId}`);

        if (response.data.status === "success") {
          setReviewData(response.data.data.review);
        } else {
          setError("Failed to fetch review data");
        }
      } catch (err) {
        console.error("Error fetching review data:", err);
        setError("Failed to fetch review data");
        showError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [reviewId]);

  const handleDownloadPDF = async () => {
    if (!reviewData) {
      toast.error("No review data available");
      return;
    }

    try {
      setDownloadingPDF(true);

      // Hide the download button temporarily for print
      const downloadButton = document.querySelector(".no-print") as HTMLElement;
      if (downloadButton) {
        downloadButton.style.display = "none";
      }

      // Trigger browser print dialog
      window.print();

      toast.success("PDF print dialog opened");
    } catch (error) {
      console.error("Error opening print dialog:", error);
      toast.error("Failed to open print dialog");
    } finally {
      setDownloadingPDF(false);

      // Show the download button again after a short delay
      setTimeout(() => {
        const downloadButton = document.querySelector(
          ".no-print"
        ) as HTMLElement;
        if (downloadButton) {
          downloadButton.style.display = "block";
        }
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading review...</span>
        </div>
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <XCircle className="w-12 h-12 text-destructive mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Review Not Found</h3>
                <p className="text-sm text-muted-foreground">
                  {error || "The requested review could not be found."}
                </p>
              </div>
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <React.Fragment>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .print-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .print-break-after {
            page-break-after: always;
            break-after: page;
          }
          .fixed {
            position: static !important;
          }
          .min-h-screen {
            min-height: auto !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
          .py-8 {
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto p-6 space-y-8 print:p-4 print:space-y-6">
          {/* Top Navigation Buttons */}
          <div className="flex items-center justify-between no-print">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              {downloadingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloadingPDF ? "Generating PDF..." : "Download PDF"}
            </Button>
          </div>
          {/* Header */}
          <div className="text-center space-y-4 print-break-inside-avoid">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-primary text-balance">
                CV Review Feedback
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Detailed Analysis and Recommendations
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Review Date: {currentDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>
                  Review Type:{" "}
                  {reviewData.review_type.charAt(0).toUpperCase() +
                    reviewData.review_type.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Score Card */}
          <Card className="print-break-inside-avoid">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-primary">
                    {reviewData.global_summary.total_score}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Total Score
                  </div>
                </div>
                <Badge
                  className={`text-lg px-4 py-2 ${getReadinessColor(
                    reviewData.global_summary.overall_readiness
                  )}`}
                >
                  {reviewData.global_summary.overall_readiness}
                </Badge>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {reviewData.global_summary.scoring_breakdown.map(
                  (item, index) => (
                    <div key={index} className="text-center space-y-1">
                      <div
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${getScoreColor(
                          item.score
                        )}`}
                      >
                        {item.score}
                      </div>
                      <div className="text-xs text-muted-foreground text-pretty">
                        {item.section_name}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Priority Fixes */}
          <Card className="print-break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Top Priority Fixes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {reviewData.global_summary.top_fixes.map((fix, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-pretty">
                      {fix}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section Reviews */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <Users className="h-6 w-6" />
              Section-by-Section Analysis
            </h2>

            {reviewData.sections.map((section, index) => (
              <Card key={index} className="print-break-inside-avoid">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(
                        section.section_status,
                        section.section_score
                      )}
                      <span className="text-pretty">
                        {section.section_name}
                      </span>
                    </div>
                    <Badge className={getScoreColor(section.section_score)}>
                      Score: {section.section_score}/4
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {section.justification}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Strengths */}
                  {section.strengths.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-2 ml-6">
                        {section.strengths.map((strength, idx) => (
                          <li
                            key={idx}
                            className="text-sm leading-relaxed text-pretty list-disc"
                          >
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {section.weaknesses.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2 ml-6">
                        {section.weaknesses.map((weakness, idx) => (
                          <li
                            key={idx}
                            className="text-sm leading-relaxed text-pretty list-disc"
                          >
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actionable Edits */}
                  {section.actionable_edits.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Recommended Actions
                      </h4>
                      <ul className="space-y-2 ml-6">
                        {section.actionable_edits.map((edit, idx) => (
                          <li
                            key={idx}
                            className="text-sm leading-relaxed text-pretty list-disc"
                          >
                            {edit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Examples */}
                  {section.examples_bad_to_better.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-accent">
                        Examples: Before & After
                      </h4>
                      {section.examples_bad_to_better.map((example, idx) => (
                        <div
                          key={idx}
                          className="bg-muted p-4 rounded-lg space-y-3"
                        >
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium text-destructive">
                                Before:
                              </span>
                              <p className="mt-1 text-muted-foreground italic text-pretty">
                                &ldquo;{example.bad}&rdquo;
                              </p>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium text-green-600">
                                After:
                              </span>
                              <p className="mt-1 text-pretty">
                                &ldquo;{example.better}&rdquo;
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground border-l-2 border-accent pl-3">
                            <strong>Why this is better:</strong>{" "}
                            {example.why_better}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Missing Content */}
                  {section.missing_content.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-destructive flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Missing Content
                      </h4>
                      <ul className="space-y-2 ml-6">
                        {section.missing_content.map((missing, idx) => (
                          <li
                            key={idx}
                            className="text-sm leading-relaxed text-pretty list-disc text-destructive"
                          >
                            {missing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Questions for User */}
          {reviewData.global_summary.questions_for_user.length > 0 && (
            <Card className="print-break-inside-avoid">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-accent">
                  <FileText className="h-5 w-5" />
                  Questions to Help Improve Your CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviewData.global_summary.questions_for_user.map(
                    (question, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-pretty">
                          {question}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rewritten CV Sections if available */}
          {reviewData.rewritten_cv &&
            reviewData.rewritten_cv.sections.length > 0 && (
              <div className="space-y-6 print-break-after">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                  <BookOpen className="h-6 w-6" />
                  Rewritten CV Sections
                </h2>
                <p className="text-muted-foreground text-pretty">
                  Below are professionally rewritten versions of your CV
                  sections, incorporating best practices and addressing the
                  feedback above.
                </p>

                {reviewData.rewritten_cv.sections.map((section, index) => (
                  <Card key={index} className="print-break-inside-avoid">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {section.section_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-sm leading-relaxed text-pretty">
                          {section.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          {/* Meta Information and Implementation Notes */}
          {reviewData.meta && (
            <Card className="print-break-inside-avoid">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-accent">
                  <Lightbulb className="h-5 w-5" />
                  Implementation Strategy & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    Version {reviewData.meta.version}
                  </Badge>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-sm leading-relaxed text-pretty bg-muted p-4 rounded-lg">
                    {reviewData.meta.notes}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Print Instructions */}
          <div className="no-print text-center text-sm text-muted-foreground border-t pt-6">
            <p>
              This review is optimized for printing. Use your browser&apos;s
              print function for a clean, professional document.
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
