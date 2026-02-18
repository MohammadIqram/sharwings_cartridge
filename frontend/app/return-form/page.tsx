"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const returnReasons = [
  "Wrong item received",
  "Item damaged",
  "Item defective",
  "Missing parts",
  "Arrived late",
  "Better price available",
  "No longer needed",
  "Ordered by mistake",
  "Product not as described",
  "Quality not as expected",
  "Received extra item",
  "Size/fit issue",
  "Changed my mind",
  "Found alternative",
  "Other",
];

export default function ReturnPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    description: "",
    reason: "",
    orderId: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.reason || !form.orderId) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (form.reason === "Other" && !form.description) {
      toast.error('Please provide a description for "Other" reason.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/return`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data && data.success) {
        toast.success("Return request submitted successfully!");
        setForm({ description: "", reason: "", orderId: "" });
        return;
      }
      toast.error(data?.message || "Failed to submit return request.");
    } catch (err: any) {
      toast.error("some error occured: ", err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Request a Return
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            We're here to help. If something isn’t right with your order,
            submit a return request below and our support team will review it
            as soon as possible.
          </p>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-100"
        >
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Return Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 border border-red-300 bg-red-50 rounded-lg">
                <TriangleAlert className="text-red-600" size={20} />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Order ID */}
            <div>
              <label className="block font-medium text-gray-700">
                Order ID *
              </label>
              <input
                type="text"
                name="orderId"
                value={form.orderId}
                onChange={handleChange}
                className="w-full mt-2 p-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter your order ID"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block font-medium text-gray-700">
                Reason for return *
              </label>
              <select
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="w-full mt-2 p-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                required
              >
                <option value="" disabled>
                  Select a reason
                </option>
                {returnReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full mt-2 p-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Describe your issue..."
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="cursor-pointer w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-sm disabled:opacity-60"
              >
                {loading && <Spinner data-icon="inline-start" />}
                Submit Return Request
              </Button>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
