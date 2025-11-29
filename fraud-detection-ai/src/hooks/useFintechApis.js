
import { useState, useCallback } from "react";
import { toast } from "sonner";

const BASE_URL = "http://localhost:5000/api";

export function useFintechApis() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [stockPrices, setStockPrices] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const logTransactionToBlockchain = useCallback(async (txId, amount, userId, status, fingerprint = "mock-fp") => {
    try {
      await fetch(`${BASE_URL}/transaction/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId, amount, userId, status, fingerprint }),
      });
    } catch (error) {
      console.error("Blockchain Logging Failed:", error);
    }
  }, []);

  
  const fetchStockPrices = useCallback(async (symbols = ["AAPL", "GOOGL", "INFY"]) => {
    try {
      const query = symbols.join(",");
      const response = await fetch(`${BASE_URL}/stocks?symbols=${query}`);

      if (!response.ok) throw new Error("Failed to fetch stock data.");

      const prices = await response.json();
      setStockPrices(prices);
      return prices;

    } catch (error) {
      console.error("Stock API Error:", error);

      toast.warning("Stock API Offline", {
        description: "Using fallback mock data.",
      });

      const fallback = { AAPL: 120, GOOGL: 90, INFY: 1000 };
      setStockPrices(fallback);
      return fallback;
    }
  }, []);

  const handlePayment = useCallback(
    async (amount, currency = "INR", userId = "user_001") => {
      setIsProcessing(true);
      setPaymentStatus(null);

      try {
        const response = await fetch(`${BASE_URL}/payment/razorpay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, userId, currency }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          toast.success("Payment Processed Successfully", {
            description: `Tx ID: ${result.txId}. Amount: ${currency} ${result.amount.toLocaleString()}. Logged to Blockchain.`,
          });

          logTransactionToBlockchain(result.txId, amount, userId, "SUCCESS");

          fetchStockPrices();
        } else {
          toast.error("Payment Failed", {
            description: result.message || "Unknown payment gateway error.",
          });
        }

        setPaymentStatus(result);
        return result;

      } catch (error) {
        toast.error("Network Error", {
          description: "Could not connect to Mock Payment Backend.",
        });

        setPaymentStatus({ success: false, error });
        return { success: false, error };

      } finally {
        setIsProcessing(false);
      }
    },
    [logTransactionToBlockchain, fetchStockPrices] 
  );

  return {
    isProcessing,
    paymentStatus,
    handlePayment,
    stockPrices,
    fetchStockPrices,
    logTransactionToBlockchain,
  };  
}
