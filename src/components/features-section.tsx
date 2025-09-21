"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Zap, Users, BarChart3, Clock, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your CV data is encrypted and protected with enterprise-grade security measures.",
    color: "text-primary",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description:
      "Get professional feedback within 24-48 hours from our expert review team.",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "Expert Reviewers",
    description:
      "Our team consists of HR professionals and industry experts across various fields.",
    color: "text-secondary",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track your CV performance and improvement metrics over time.",
    color: "text-primary",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Round-the-clock customer support to help you with any questions or concerns.",
    color: "text-accent",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description:
      "We guarantee high-quality feedback or your money back within 30 days.",
    color: "text-secondary",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30 px-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Why Choose Our CV Management System?
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            We provide comprehensive CV review services with cutting-edge
            technology and expert human insight.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-4">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-background shadow-sm group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
