"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, Clock, Percent } from "lucide-react";
import Link from "next/link";

type DashboardStats = {
  total_cvs: number;
  total_pending_cvs: number;
  total_reviews: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/dashboard-stats");
        // Expected shape: { status: 'success', data: { total_cvs, total_pending_cvs, total_reviews } }
        setStats(res.data?.data as DashboardStats);
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-white mx-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor CV review operations and business metrics
          </p>
        </div>

        {/* Main Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total CVs */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-blue-600 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-blue-700">Total CVs</CardTitle>
              <CardDescription>All CV submissions</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {loading ? "—" : stats?.total_cvs ?? 0}
                </span>
                <p className="text-sm text-gray-600">Total CVs</p>
              </div>
              <Link href="/admin-dashboard/total">
                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700  hover:bg-blue-500"
                >
                  All CVs
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Reviewed CVs */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-green-600 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-green-700">
                Reviewed CVs
              </CardTitle>
              <CardDescription>Completed reviews</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {loading ? "—" : stats?.total_reviews ?? 0}
                </span>
                <p className="text-sm text-gray-600">Reviewed CVs</p>
              </div>
              <Link href="/admin-dashboard/reviewed">
                <Button
                  variant="outline"
                  className="w-full border-green-300 text-green-700  hover:bg-green-500"
                >
                  View Reviewed
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pending CVs Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-amber-500  bg-white">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl text-amber-700">
                Pending CVs
              </CardTitle>
              <CardDescription>CVs awaiting review</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <span className="text-3xl font-bold text-amber-600">
                  {loading ? "—" : stats?.total_pending_cvs ?? 0}
                </span>
                <p className="text-sm text-gray-600">Review queue</p>
              </div>
              <Link href="/admin-dashboard/pending">
                <Button
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700  hover:bg-amber-500"
                >
                  View Pending
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Create Discount Coupons Card */}
          {/* <Card className="hover:shadow-lg transition-shadow duration-300 border-purple-600 bg-white">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Percent className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-purple-700">
                Discount Coupons
              </CardTitle>
              <CardDescription>
                Create and manage promotional codes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <span className="text-3xl font-bold text-purple-600">8</span>
                <p className="text-sm text-gray-600">Active coupons</p>
              </div>
              <Link href="/admin/coupons">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Create Coupon
                </Button>
              </Link>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
