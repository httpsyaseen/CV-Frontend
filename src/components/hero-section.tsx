"use client";

import { Button } from "@/components/ui/button";
import { Upload, Eye, MessageSquare, CheckCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative py-20 lg:py-32 overflow-hidden px-16"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                Streamline Your <span className="text-primary">CV Review</span>{" "}
                Process
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
                Upload your CV, get expert feedback from admins, and land your
                dream job. Our platform connects job seekers with professional
                reviewers for personalized career guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 animate-pulse-glow"
              >
                Login Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 bg-transparent"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">
                  CVs Reviewed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">
                  Expert Reviewers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Process Flow */}
          <div className="space-y-6 animate-slide-in-right">
            <div className="bg-card rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-card-foreground">
                    1. Upload Your CV
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Simply drag and drop your CV or browse to upload. We support
                    all major formats.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 delay-100">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-card-foreground">
                    2. Expert Review
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our professional admins carefully review your CV and
                    identify areas for improvement.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 delay-200">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-card-foreground">
                    3. Get Feedback
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Receive detailed, actionable feedback to enhance your CV and
                    boost your chances.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 delay-300">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-card-foreground">
                    4. Land Your Job
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Apply with confidence using your improved CV and increase
                    your success rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
