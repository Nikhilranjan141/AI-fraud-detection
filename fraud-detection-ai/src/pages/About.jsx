import React from "react";
import { Shield, Target, Award, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About
              <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                RakshakX
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Leading the future of financial security with artificial intelligence
            </p>
          </div>

          <div className="space-y-12">
            <Card className="p-8 border-border bg-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We're building the most advanced AI-powered fraud detection system to protect financial institutions 
                    and their customers from evolving cyber threats. Our mission is to make financial transactions 
                    safer, faster, and more secure through cutting-edge machine learning technology.
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "Our Vision",
                  description: "Create a fraud-free financial ecosystem where every transaction is protected by AI"
                },
                {
                  icon: Award,
                  title: "Our Values",
                  description: "Innovation, security, transparency, and customer trust are at our core"
                },
                {
                  icon: Users,
                  title: "Our Team",
                  description: "Expert AI researchers, security specialists, and fintech professionals"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={idx} className="p-6 border-border bg-card">
                    <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </Card>
                );
              })}
            </div>

            <Card className="p-8 border-border bg-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Technology Stack</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Machine Learning</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      Isolation Forest for anomaly detection
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      Autoencoders for pattern recognition
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      Random Forest & XGBoost classifiers
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      Deep learning neural networks
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Infrastructure</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      Real-time stream processing
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      Distributed cloud architecture
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      Edge computing for low latency
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      Kubernetes orchestration
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border bg-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Impact & Results</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { value: "₹2.4Cr+", label: "Fraud Prevented" },
                  { value: "50+", label: "Financial Institutions" },
                  { value: "10M+", label: "Transactions Analyzed" },
                  { value: "99.8%", label: "Detection Accuracy" }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 border-primary/20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Join Us in Fighting Financial Fraud
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Partner with us to protect your customers and prevent financial crimes with AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:contact@frauddetection.ai" className="text-primary font-medium hover:underline">
                  contact@frauddetection.ai
                </a>
                <span className="text-muted-foreground hidden sm:block">•</span>
                <a href="tel:+911234567890" className="text-primary font-medium hover:underline">
                  +91 123 456 7890
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
