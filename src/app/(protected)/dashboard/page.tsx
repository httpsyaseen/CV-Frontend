"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Plus } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white ">
      <div className="container mx-auto px-4 md:px-16 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CV Management Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your CV review requests and track their progress
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mx-auto">
          {/* New Request Card */}
          <Card className="shadow-lg transition-shadow duration-300 bg-white border-emerald-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl text-emerald-700">
                New Request
              </CardTitle>
              <CardDescription>
                Submit a new CV for professional review
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard/new-request">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Create New Request
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pending Requests Card */}
          <Card className="shadow-lg bg-white transition-shadow duration-300 border-amber-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl text-amber-700">
                Pending Requests
              </CardTitle>
              <CardDescription>
                View your submitted requests under review
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard/pending">
                <Button
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent hover:text-amber-400"
                >
                  View Pending
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Reviewed Requests Card */}
          <Card className="shadow-lg bg-white transition-shadow duration-300 border-green-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-700">
                Reviewed Requests
              </CardTitle>
              <CardDescription>
                Access your completed CV reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard/reviewed">
                <Button
                  variant="outline"
                  className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent hover:text-green-800"
                >
                  View Completed
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
