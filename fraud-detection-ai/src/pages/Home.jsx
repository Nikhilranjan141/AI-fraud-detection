import React from "react";
import { Shield, Zap, Brain, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Security</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            AI-powered real
            <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Time Fraud-Detection
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time AI detection system that identifies suspicious transactions,
            analyzes user behavior, and predicts fraud with 99.8% accuracy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 text-lg px-8">
                View Live Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: "99.8%", label: "Detection Accuracy" },
            { value: "< 50ms", label: "Response Time" },
            { value: "24/7", label: "Real-time Monitoring" },
            { value: "₹2.4Cr", label: "Fraud Prevented" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Advanced AI Protection
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Machine learning algorithms that adapt to evolving fraud patterns
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Brain,
              title: "Anomaly Detection",
              description:
                "AI models identify unusual patterns in real-time using Isolation Forest and Autoencoders",
            },
            {
              icon: Zap,
              title: "Real-time Analysis",
              description:
                "Process millions of transactions per second with instant fraud alerts",
            },
            {
              icon: Lock,
              title: "Behavior Profiling",
              description:
                "Build unique user profiles based on spending patterns, location, and device",
            },
            {
              icon: Shield,
              title: "Risk Scoring",
              description:
                "Advanced ML models predict fraud probability for every transaction",
            },
            {
              icon: CheckCircle,
              title: "Auto-Response",
              description:
                "Automatically block suspicious transactions and notify users instantly",
            },
            {
              icon: Brain,
              title: "Adaptive Learning",
              description:
                "Continuously improves detection accuracy by learning from new fraud patterns",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="p-6 border-border bg-card hover:bg-card/80 transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three-layer AI defense system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Real-time Monitoring",
                description:
                  "Every transaction is analyzed instantly using multiple AI models",
              },
              {
                step: "02",
                title: "Risk Assessment",
                description:
                  "ML algorithms calculate fraud probability based on 50+ parameters",
              },
              {
                step: "03",
                title: "Instant Action",
                description:
                  "High-risk transactions are flagged or blocked automatically",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/4 -right-4 w-8 h-0.5 bg-primary/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center border-primary/20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Secure Your Transactions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading fintech companies protecting billions in transactions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
