"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RecommendationSection {
  title: string;
  items: string[];
}

export interface RecommendationsCardProps {
  title?: string;
  sections: RecommendationSection[];
  className?: string;
}

export function RecommendationsCard({
  title = "Strategic Recommendations",
  sections,
  className,
}: RecommendationsCardProps) {
  return (
    <Card className={cn("border-0", className)}>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="h-5 w-5 text-black dark:text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold leading-none tracking-tight">
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DefaultRecommendationsCard() {
  const defaultSections: RecommendationSection[] = [
    {
      title: "Immediate Actions (30 Days)",
      items: [
        "Investigate INS and INSUR critical return rates",
        "Implement quality control at ECOM branch",
        "Analyze MAIN branch success factors",
      ],
    },
    {
      title: "Medium-term Strategy (3-6 Months)",
      items: [
        "Expand DM branch operational model",
        "Cross-train staff from top performers",
        "Develop return prevention protocols",
      ],
    },
    {
      title: "Long-term Optimization (6-12 Months)",
      items: [
        "Standardize best practices across branches",
        "Implement predictive analytics",
        "Optimize branch-specific strategies",
      ],
    },
  ];

  return <RecommendationsCard sections={defaultSections} />;
}

export function CustomerStrategyRecommendationsCard() {
  const customerSections: RecommendationSection[] = [
    {
      title: "Immediate Actions (30 Days)",
      items: [
        "Launch VIP customer recognition program",
        "Implement one-time buyer reactivation campaign",
        "Establish dedicated account management for top 50 customers",
      ],
    },
    {
      title: "Medium-term Strategy (3-6 Months)",
      items: [
        "Develop tiered loyalty program across all segments",
        "Create personalized marketing by customer segment",
        "Focus on occasional buyer upgrade to regular status",
      ],
    },
    {
      title: "Long-term Optimization (6-12 Months)",
      items: [
        "Build comprehensive customer journey mapping",
        "Implement predictive CLV models",
        "Automated retention triggers and interventions",
      ],
    },
  ];

  return (
    <RecommendationsCard
      title="Customer Strategy Recommendations"
      sections={customerSections}
    />
  );
}

export function StaffPerformanceRecommendationsCard() {
  const staffSections: RecommendationSection[] = [
    {
      title: "Immediate Actions (30 Days)",
      items: [
        "Recognize and reward elite performers: RESSIE DARAMAN (13.00% market share), VENKANNA VAVILALA SARVESAM, BAHAR JARAH",
        "Investigate OMAR FATHI ABU SAMRA's 695.62% profit margin methodology for company-wide implementation",
        "Address extreme performance gap: Bottom 25% staff generate only 1.8% of revenue vs top 25% generating 61.0%",
      ],
    },
    {
      title: "Medium-term Strategy (3-6 Months)",
      items: [
        "Implement RESSIE DARAMAN's excellence methodology across all sales staff (43,987 AED/day productivity)",
        "Develop high-margin selling techniques training based on profitability leaders (158.48% avg weighted profit)",
        "Create performance improvement plans for bottom quartile performers (avg sales: AED 28,867)",
      ],
    },
    {
      title: "Long-term Optimization (6-12 Months)",
      items: [
        "Reduce performance concentration risk - top 3 performers generate 20.74% of total sales",
        "Implement succession planning around RESSIE DARAMAN's expertise and ERWIN ACUNA's efficiency model",
        "Revenue optimization potential: AED 10.3M if bottom 50% achieve median performance",
      ],
    },
  ];

  return (
    <RecommendationsCard
      title="Staff Performance Strategic Recommendations"
      sections={staffSections}
    />
  );
}

export function InventoryStrategicRecommendationsCard() {
  const inventorySections: RecommendationSection[] = [
    {
      title: "Immediate Actions (30 Days)",
      items: [
        "Expand RAYBAN and premium SUNGLASS inventory based on performance",
        "Analyze BL - VINTAGE success model for margin optimization",
        "Review Exclusive price point strategy for market expansion",
      ],
    },
    {
      title: "Medium-term Strategy (3-6 Months)",
      items: [
        "Develop MEDICAL LENS category with high-margin focus",
        "Implement premium brand partnership strategies",
        "Optimize product line combinations for margin enhancement",
      ],
    },
    {
      title: "Long-term Optimization (6-12 Months)",
      items: [
        "Reduce category concentration risk through diversification",
        "Expand premium category portfolio",
        "Develop private label high-margin products",
      ],
    },
  ];

  return (
    <RecommendationsCard
      title="Inventory Strategic Recommendations"
      sections={inventorySections}
    />
  );
}
