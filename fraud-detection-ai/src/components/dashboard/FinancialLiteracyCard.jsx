import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, HelpCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const TIPS = [
    { id: 1, title: "Start with SIPs (Systematic Investment Plans)", content: "Invest small fixed amounts monthly in Mutual Funds instead of large lump sums. It helps average out costs.", category: "Mutual Funds" },
    { id: 2, title: "PPF and NSC Schemes", content: "Public Provident Fund (PPF) and National Savings Certificate (NSC) are government-backed schemes offering tax benefits (under Section 80C) and guaranteed returns.", category: "Govt Schemes" },
    { id: 3, title: "The 50/30/20 Rule", content: "Allocate 50% of income to Needs (rent, food), 30% to Wants (entertainment), and 20% to Savings/Investments.", category: "Budgeting" },
    { id: 4, title: "Term Insurance: Priority One", content: "Before starting investments, ensure you have sufficient Term Life Insurance coverage to secure your family.", category: "Insurance" },
];

const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "Which investment offers tax benefits under Section 80C in India?",
        options: ["Gold ETF", "NPS (National Pension System)", "Stocks"],
        answer: "NPS (National Pension System)"
    },
    {
        id: 2,
        question: "What is the primary risk of investing in Equity Mutual Funds?",
        options: ["Liquidity Risk", "Market Risk", "Credit Risk"],
        answer: "Market Risk"
    }
];

const FinancialLiteracyCard = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleAnswer = (selectedOption) => {
        if (quizCompleted || showAnswer) return;

        setSelectedAnswer(selectedOption);
        setShowAnswer(true);

        if (selectedOption === QUIZ_QUESTIONS[currentQuestion].answer) {
            setScore(score + 1);
        }
        
        setTimeout(() => {
            setShowAnswer(false);
            setSelectedAnswer(null);
            if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                setQuizCompleted(true);
            }
        }, 1500);
    };

    return (
        <Card className="p-6 border-border bg-card">
            <div className="flex items-center gap-3 mb-6 border-b pb-4 border-border">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Financial Literacy Module</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-teal-700">
                        <Lightbulb className="h-4 w-4" /> Investment Basics
                    </h3>
                    <ScrollArea className="h-[250px] pr-4">
                        {TIPS.map(tip => (
                            <div key={tip.id} className="p-3 border rounded-lg mb-3 bg-background/50">
                                <Badge variant="secondary" className="mb-1">{tip.category}</Badge>
                                <p className="font-medium text-foreground">{tip.title}</p>
                                <p className="text-sm text-muted-foreground mt-0.5">{tip.content}</p>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                <div className="space-y-4 border-l pl-6 border-border/50">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-amber-500" /> Financial Quiz
                    </h3>

                    {!quizCompleted ? (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} / {QUIZ_QUESTIONS.length}</p>
                            <p className="font-medium text-foreground">{QUIZ_QUESTIONS[currentQuestion].question}</p>
                            <div className="space-y-2">
                                {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => {
                                    const isCorrect = showAnswer && option === QUIZ_QUESTIONS[currentQuestion].answer;
                                    const isSelected = selectedAnswer === option;
                                    
                                    let variant = "outline";
                                    if (showAnswer) {
                                        if (isCorrect) variant = "default";
                                        else if (isSelected) variant = "destructive";
                                    }

                                    return (
  <Button
    key={index}
    variant={variant}
    onClick={() => handleAnswer(option)}
    disabled={showAnswer}
    className={`w-full justify-start transition-colors 
      ${isCorrect ? 'bg-risk-safe hover:bg-risk-safe/80 text-white' : ''} 
      ${isSelected && !isCorrect && showAnswer ? 'bg-destructive/80 text-white' : ''}`
    }
  >
    {option}
  </Button>
);

                                })}
                            </div>
                            {showAnswer && (
                                <p
  className={`text-sm font-semibold ${
    selectedAnswer === QUIZ_QUESTIONS[currentQuestion].answer
      ? "text-risk-safe"
      : "text-destructive"
  }`}
>
  {selectedAnswer === QUIZ_QUESTIONS[currentQuestion].answer
    ? "Correct Answer!"
    : "Incorrect Answer."}
</p>

                            )}
                        </div>
                    ) : (
                        <div className="text-center p-6 border rounded-lg bg-risk-low/10">
                            <CheckCircle className="h-8 w-8 text-risk-safe mx-auto mb-3" />
                            <h4 className="font-bold text-xl text-foreground">Quiz Complete!</h4>
                            <p className="text-muted-foreground">Your Score: {score} out of {QUIZ_QUESTIONS.length}</p>
                            <Button onClick={() => { setCurrentQuestion(0); setScore(0); setQuizCompleted(false); }} className="mt-4">
                                Retake Quiz
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default FinancialLiteracyCard;