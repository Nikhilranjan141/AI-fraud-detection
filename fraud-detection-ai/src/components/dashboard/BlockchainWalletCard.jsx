import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bitcoin, Send, Smartphone, Wallet, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useFintechApis } from '@/hooks/useFintechApis';

const INITIAL_BALANCE = 150000;
const USER_ID = "user_001";

const BlockchainWalletCard = () => {
    const { logTransactionToBlockchain } = useFintechApis();
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [amount, setAmount] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleTransfer = async (type) => {
        if (amount <= 0 || amount > balance || !recipient) {
            toast.error("Invalid Transfer", { description: "Check amount and recipient details." });
            return;
        }

        setIsProcessing(true);

       const txId = `${type}_TXN_${Date.now()}`;

        let delayMs = type === 'UPI' ? 500 : 3000; 

        try {
            await new Promise(resolve => setTimeout(resolve, delayMs));

            if (type === 'CRYPTO') {
               
                await logTransactionToBlockchain(txId, amount, USER_ID, 'CRYPTO_TRANSFER', 'wallet_fp_hash');
                toast.success("Crypto Remittance Successful", {
                    description: `₹${amount.toLocaleString()} sent to ${recipient}. Tx Logged on Mock Blockchain.`,
duration: 5000

                });
            } else {
                toast.success("UPI Micro-Payment Successful", {
                    description: `₹${amount.toLocaleString()} sent instantly to ${recipient}.`,

                });
            }

            setBalance(prev => prev - amount);
            setAmount(0);
            setRecipient('');

        } catch (error) {
            toast.error("Transfer Failed", { description: "Could not complete the transaction." });
        } finally {
            setIsProcessing(false);
        }
    };

    const isInputValid = amount > 0 && amount <= balance && recipient.length > 5;

    return (
        <Card className="p-6 border-border bg-card">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Blockchain Secure Wallet</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <h3 className="text-2xl font-bold text-risk-low">₹{balance.toLocaleString()}</h3>
                </div>
            </div>

            <p className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> Select Transaction Type:
            </p>

            <div className="space-y-4">
                <Input 
                    type="number" 
                    placeholder="Amount to send (₹)" 
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="1"
                    className="mb-2"
                />
                <Input 
                    type="text" 
                    placeholder="Recipient UPI ID / Crypto Address" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <Button 
                        onClick={() => handleTransfer('UPI')}
                        disabled={isProcessing || !isInputValid}
                        variant="outline"
                        className="gap-2"
                    >
                        <Smartphone className="h-4 w-4" /> 
                        {isProcessing ? "Sending..." : "UPI Micro-Payment"}
                    </Button>
                    <Button 
                        onClick={() => handleTransfer('CRYPTO')}
                        disabled={isProcessing || !isInputValid}
                        className="gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                        <Bitcoin className="h-4 w-4" /> 
                        {isProcessing ? "Securing..." : "Crypto Remittance"}
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
                *Crypto remittance uses Mock Blockchain logging for security and traceability.
            </p>
        </Card>
    );
};

export default BlockchainWalletCard;