import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { useFintechApis } from "@/hooks/useFintechApis"; 
import { toast } from 'sonner';

const PaymentDemoCard = () => {
    const { 
        isProcessing, 
        handlePayment, 
        stockPrices, 
        fetchStockPrices, 
    } = useFintechApis();
    
    const [inputAmount, setInputAmount] = useState(null); 

    const [symbolInput, setSymbolInput] = useState('TSLA');
    const [mockKey] = useState("RZP_Mock_Key_456789");
    const [stockError, setStockError] = useState(false); 

    useEffect(() => {
       
        const fetchAndCheckStocks = async () => {
           
            const prices = await fetchStockPrices(["AAPL", "INFY", "GOOGL"]); 
            
            if (Object.keys(prices).length === 0) {
                setStockError(true);
            } else {
                setStockError(false);
            }
        };

        fetchAndCheckStocks();
        const interval = setInterval(fetchAndCheckStocks, 5000); 
        return () => clearInterval(interval);
    }, [fetchStockPrices]);

    const startPayment = () => {
        if (!inputAmount || inputAmount <= 0) {
            toast.error("Invalid Amount", { description: "Please enter a valid payment amount (> 0)." });
            return;
        }
        handlePayment(inputAmount); 
    };

    const handleFetchSpecificStock = () => {
        if (symbolInput.trim()) {
            fetchStockPrices([symbolInput.toUpperCase(), 'INFY', 'HDFC']); 
        }
    };

    const displayAmount = inputAmount === null || inputAmount === 0 ? '' : inputAmount; 
    const isPayButtonDisabled = isProcessing || !inputAmount || inputAmount <= 0;
    
    const displayedStocks = Object.entries(stockPrices);

    return (
        <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> API Integration Demo
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
                Mock services for *FinTech APIs* (Payments & Investment) integrated with *Backend Logging*.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4 border-r md:pr-4 border-border/50">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Mock Payment (Razorpay API)
                    </h3>
                    <p className="text-xs text-muted-foreground break-all">Gateway Key: {mockKey}</p>
                    
                    <div className="space-y-2">
                        <Input 
                            type="number" 
                            placeholder="Enter Amount (e.g., 5000)" 
                            value={displayAmount} 
                            
                            onChange={e => setInputAmount(e.target.value === '' ? null : Number(e.target.value))} 
                            min="1"
                        />
                        <Button 
                            onClick={startPayment} 
                            disabled={isPayButtonDisabled} 
                            className="w-full"
                        >
                            {isProcessing ? "Processing Payment..." : `Pay ₹${(inputAmount || 0).toLocaleString()}`}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Successful payment triggers **Blockchain Transaction Logging* on the Node.js backend.
                    </p>
                </div>

                <div className="space-y-4 md:pl-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" /> Mock Stock Prices (External API)
                    </h3>
                    
                    {stockError ? (
                        <div className="p-2 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" /> Stock API Offline. Backend not running.
                        </div>
                    ) : (
                        <div className="text-xs text-risk-safe">Mock data connected and auto-refreshing.</div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                        {displayedStocks.map(([symbol, price]) => (
                            <div key={symbol} className="p-2 border rounded-lg bg-background/50">
                                <p className="text-sm font-medium text-muted-foreground">{symbol}</p>
                                <p className="text-lg font-bold text-risk-safe">₹{price}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Input 
                            type="text" 
                            placeholder="Enter Symbol (e.g., TSLA)" 
                            value={symbolInput} 
                            onChange={e => setSymbolInput(e.target.value.toUpperCase())} 
                            className="flex-1"
                        />
                        <Button variant="outline" size="sm" onClick={handleFetchSpecificStock}>
                            Fetch
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PaymentDemoCard;