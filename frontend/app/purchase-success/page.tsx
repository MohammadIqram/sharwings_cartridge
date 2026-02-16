
"use client";

import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

useEffect(() => {
  // Only runs on client
  const searchParams = new URLSearchParams(window.location.search);

  const paymentId = searchParams.get("payment_id");
  const orderIdParam = searchParams.get("order_id");
  const signature = searchParams.get("token");

  setOrderId(orderIdParam);

  if (paymentId && orderIdParam && signature) {
    const handleRazorpaySuccess = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/razorpay-success`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, orderId: orderIdParam, signature }),
        });
      } catch (err) {
        console.error(err);
        setError("Payment verification failed");
      } finally {
        setIsProcessing(false);
      }
    };

    handleRazorpaySuccess();
  } else {
    setIsProcessing(false);
    setError("No Razorpay payment details found in the URL");
  }
}, []); // empty deps → runs once on client

  if (isProcessing) return <p className="text-center mt-20 text-blue-700">Processing...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">Error: {error}</p>;

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-blue-50">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-blue-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-green-400 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-400 mb-2">
            Purchase Successful!
          </h1>

          <p className="text-blue-100 text-center mb-2">
            Thank you for your order. {"We're"} processing it now.
          </p>
          <p className="text-green-200 text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>

          <div className="bg-blue-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-200">Order number</span>
              <span className="text-sm font-semibold text-green-400">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-200">Estimated delivery</span>
              <span className="text-sm font-semibold text-green-400">3-5 business days</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4
               rounded-lg transition duration-300 flex items-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>

            <Link
              href="/"
              className="w-full bg-blue-700 hover:bg-blue-600 text-green-200 font-bold py-2 px-4
               rounded-lg transition duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
