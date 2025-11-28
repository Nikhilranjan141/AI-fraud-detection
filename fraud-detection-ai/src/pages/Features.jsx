import React from "react";
import { 
  Brain, Shield, Zap, TrendingUp, Users, Lock, 
  Bell, BarChart3, Database, Eye 
} from "lucide-react";

import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: Brain,
    title: "AI Anomaly Detection",
    description:
      "Advanced machine learning models detect suspicious patterns using Isolation Forest, Local Outlier Factor, and Autoencoders.",
    features: [
      "Real-time transaction analysis",
      "Multi-model ensemble approach",
      "Adaptive learning algorithms",
      "99.8% detection accuracy",
    ],
  },
  {
    icon: Users,
    title: "User Behavior Profiling",
    description:
      "Build comprehensive user profiles to identify unusual activity based on historical patterns.",
    features: [
      "Spending pattern analysis",
      "Location tracking",
      "Device fingerprinting",
      "Time-based behavior modeling",
    ],
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description:
      "AI models predict fraud probability before transactions complete using advanced ML algorithms.",
    features: [
      "Random Forest classification",
      "XGBoost prediction models",
      "Risk score calculation",
      "Real-time probability assessment",
    ],
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description:
      "Instant notifications for suspicious activities with customizable risk thresholds.",
    features: [
      "Multi-channel alerts",
      "Priority-based notifications",
      "Configurable triggers",
      "Instant SMS/Email alerts",
    ],
  },
  {
    icon: Shield,
    title: "Admin Control Panel",
    description:
      "Comprehensive dashboard for fraud rule management and system configuration.",
    features: [
      "Custom rule creation",
      "Threshold adjustments",
      "User management",
      "Suspicious user tracking",
    ],
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Deep insights into fraud patterns with interactive visualizations and reports.",
    features: [
      "Real-time dashboards",
      "Trend analysis",
      "Heatmap visualizations",
      "Custom reporting",
    ],
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description:
      "Process millions of transactions per second with sub-50ms response time.",
    features: [
      "Distributed architecture",
      "In-memory processing",
      "Edge computing",
      "Auto-scaling infrastructure",
    ],
  },
  {
    icon: Database,
    title: "Transaction History",
    description:
      "Complete audit trail with detailed transaction logs and forensic analysis.",
    features: [
      "Full transaction history",
      "Forensic investigation tools",
      "Pattern discovery",
      "Historical analysis",
    ],
  },
  {
    icon: Eye,
    title: "Live Monitoring",
    description:
      "24/7 real-time surveillance of all transactions with instant fraud detection.",
    features: [
      "Continuous monitoring",
      "Live transaction feed",
      "Risk-based color coding",
      "Instant flagging",
    ],
  },
  {
    icon: Lock,
    title: "Secure Architecture",
    description:
      "Bank-grade security with end-to-end encryption and compliance standards.",
    features: [
      "256-bit encryption",
      "PCI DSS compliant",
      "SOC 2 certified",
      "Regular security audits",
    ],
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Powerful Features for
            <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Complete Fraud Protection
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Enterprise-grade AI security features built for modern fintech applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="p-6 border-border bg-card hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>

                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="p-8 max-w-4xl mx-auto border-primary/20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Technical Specifications
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                { label: "Processing Speed", value: "< 50ms" },
                { label: "Accuracy Rate", value: "99.8%" },
                { label: "Uptime", value: "99.99%" },
                { label: "Transactions/sec", value: "1M+" },
                { label: "ML Models", value: "10+" },
                { label: "Data Points", value: "50+" },
              ].map((spec, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {spec.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{spec.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
